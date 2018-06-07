# Folder where qualtrics outputs are located
outDir = "orig"

import os
import re

allLists = dict()
wordsToLure = dict()
with open("wordlists.csv", "rb") as inFile:
    for line in inFile:
        words = line.lower().replace("\n","").replace("\r","").split(",")
        allLists[words[0]] = set(words[1:])
        for word in words[1:]:
            wordsToLure[word] = words[0]
            
conditionLists = {str(condition):dict() for condition in xrange(1,7)}
with open("conditionslist.csv", "rb") as inFile:
    for line in inFile:
        splitLine = line.lower().replace("\n","").replace("\r","").split(",")
        condition = splitLine[0].replace("condition ","")
        talker = splitLine[1]
        for word in splitLine[2:]:
            conditionLists[condition][word] = talker
            
corrections = dict()
with open("word-replacements.csv", "rb") as inFile:
    for line in inFile:
        word, replacement = line.lower().replace("\n","").replace("\r","").split(",")
        corrections[word] = replacement

allFiles = os.listdir(outDir)

with open("processed-recall.csv", "wb") as recallFile:
    
    # write recall file header
    recallFile.write("Subject,Subject.readInstructions,Subject.gender,Subject.age,Subject.ethnicity,Subject.education,Subject.nativelang,Subject.languages,Subject.location,Condition,Talker,Lure,Recalled,PropListRecalled,PropCorrectRecalls,RecalledLure,FalseRecall")
    
    with open("processed-recognition.csv", "wb") as recogFile:
        
        recogFile.write("Subject,Subject.readInstructions,Subject.gender,Subject.age,Subject.ethnicity,Subject.education,Subject.nativelang,Subject.languages,Subject.location,Condition,Word,Status,Lure,LureTalker,Task,Judgment,JudgmentCorrect,Talker,Attribution,AttributionCorrect,AttributionLureTalker,TrialCorrect")

        for filename in allFiles:
            
            condition = filename.replace("list ","").replace(" results.csv","")
            
            with open("%s/%s" % (outDir, filename), "rb") as inFile:
                
                headers = inFile.next().replace("\n","").replace("\r","").split(",")
                
                secondHeaders = inFile.next().replace("\n","").replace("\r","").split(",")
                
                secondHeadersDict = {headers[i]:secondHeaders[i] for i in xrange(len(headers))}
                
                # skip the third line
                inFile.next()
                
                # process each line
                for line in inFile:
                    
                    splitLine = re.sub(r'"[^"]*"', lambda m: m.group(0).replace(',', ' '), line).replace("\n","").replace("\r","").replace('",',",").replace(',"',",").split(",")
                    
                    if len(splitLine) == len(headers):
                        
                        lineDict = {headers[i]:splitLine[i] for i in xrange(len(headers))}
                        
                        subj = lineDict["ResponseId"]
                        subjInstr = lineDict["Q178"]
                        subjGender = lineDict["Q181"]
                        subjAge = lineDict["Q182"]
                        subjEthnicity = lineDict["Q183"]
                        subjEducation = lineDict["Q188"]
                        subjNative = lineDict["Q184"]
                        subjLangs = lineDict["Q185"]
                        subjLocation = lineDict["Q186"]
                        
                        subjStuff = ",".join([subj, subjInstr, subjGender, subjAge, subjEthnicity, subjEducation, subjNative, subjLangs, subjLocation])
                        
                        luresToTasks = dict()
                        
                        for blockpair in range(1,9):
                            
                            if "Recall blockpair%s" % blockpair in headers:
                            
                                words = re.sub(r'\s+', ' ', lineDict["Recall blockpair%s" % blockpair].lower().replace(".","").replace("\n"," ").replace("\r","")).strip()
                                talker, lure = lineDict["blockpair%s_recall" % blockpair].split("-")
                                talker = talker.replace("aave","deshaun")
                                
                                wordSet = set(words.split(" "))
                                listSet = allLists[lure]
                                for word in wordSet:
                                    if word + "s" == lure:
                                        wordSet.remove(word)
                                        wordSet.add(lure)
                                    elif word[:-1] == lure:
                                        wordSet.remove(word)
                                        wordSet.add(lure)
                                    elif word + "s" in listSet:
                                        wordSet.remove(word)
                                        wordSet.add(word + "s")
                                    elif word[:-1] in listSet:
                                        wordSet.remove(word)
                                        wordSet.add(word[:-1])
                                    elif word in corrections:
                                        wordSet.remove(word)
                                        wordSet.add(corrections[word])                          
                                
                                recalledLure = lure in wordSet
                                falseRecalls = " ".join(wordSet - listSet)
                                propListRecalled = 1 - float(len(listSet - wordSet))/len(listSet)
                                propCorrectRecalls = 1 - float(len(wordSet - listSet))/len(wordSet)
                                
                                recallFile.write("\n" + ",".join([subjStuff, condition, talker, lure, words, str(propListRecalled), str(propCorrectRecalls), str(recalledLure), falseRecalls]))
                                
                                luresToTasks[lure] = "Recall"
                                luresToTasks[lineDict["blockpair%s_math" % blockpair].split("-")[1]] = "Math"
                        
                        for wordnum in range(1,98):
                            
                            if "%s_Q17" % wordnum in headers:
                            
                                word = secondHeadersDict["%s_Q17" % wordnum].replace(" - [Field-1]","").lower()
                                
                                response = lineDict[lineDict["%s_Q17" % wordnum].replace("${e://Field/","").replace("}","")]
                                
                                if "-" in response:
                                    judgment = "old"
                                    attribution = response.replace(" - old", "").lower()
                                else:
                                    judgment = response
                                    if judgment == "old":
                                        attribution = "Unknown"
                                    else:
                                        attribution = "NA"
                                    
                                if word in wordsToLure and wordsToLure[word] in conditionLists[condition]:
                                    status = "old"
                                else:
                                    status = "new"
                                    
                                if status=="new" and word in conditionLists[condition]:
                                    isLure = True
                                else:
                                    isLure = False
                                    
                                if isLure:
                                    lureTalker = conditionLists[condition][word]
                                else:
                                    lureTalker = "NA"
                                    
                                judgmentCorrect = judgment == status
                                
                                if status == "old":
                                    talker = conditionLists[condition][wordsToLure[word]]
                                    task = luresToTasks[wordsToLure[word]]
                                else:
                                    talker = "NA"
                                    task = "NA"
    
                                if attribution in ["Unknown", "NA"]:
                                    attributionCorrect = "NA"
                                else:
                                    attributionCorrect = attribution == talker    
                                    
                                if isLure:
                                    if attribution in ["Unknown", "NA"]:
                                        attributionLureTalker = "NA"
                                    else:
                                        attributionLureTalker = attribution == lureTalker
                                else:
                                    attributionLureTalker = "NA"
                                    
                                trialCorrect = judgmentCorrect and attributionCorrect == True
    
                                recogFile.write("\n" + ",".join([subjStuff, condition, word, status, str(isLure), lureTalker, task, judgment, str(judgmentCorrect), talker, attribution, str(attributionCorrect), str(attributionLureTalker), str(trialCorrect)]))