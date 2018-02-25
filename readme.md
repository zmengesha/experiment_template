# Instructions


## Put the Experiment on your Webspace

1. Open the command line and move to the place where you want to put the experiment.

2. Execute `git clone https://github.com/m-hahn/experiment_template.git`.

If you have not yet installed git, an alternative is to go to `https://github.com/m-hahn/experiment_template`, click on `Clone or download`, then `Download ZIP`. After downloading, unpack the archive at the intended place.

3. Open a new tab in your browser, and paste the following path into the address bar: `PATH/experiment_template/template/template.html`, where `PATH` is the path where you put the experiment template in the previous step. (You can use `pwd` to display the current path in the command line.) Hit Enter to open this page.

5. You should now see the welcome page of a mock experiment. You can click through it to see what it looks like. If you are already familiar with HTML and Javascript, you can adapt the template for your needs. In any case, for this workshop, we'll pretend that this is the experiment that you want to run.
 
6. In order for participants to see you experiments on the web, you will now upload it to your Stanford webspace.

7. Open a new command line tab. Type `ssh YOUR_SUNET_ID@cardinal` and hit enter. Go through the authentication procedure.

8. Execute `ls WWW`. Unles you have already put things in your webspace, nothing should show up. If an error message appears, execute `mkdir WWW`.

9. Going back to the previos tab, execute `scp -r experiment_template YOUR_SUNET_ID@cardinal:~/WWW/`

10. Once this has finished, open `http://stanford.edu/~YOUR_SUNET_ID/experiment_template/template/template.html` in your browser. The experiment should show up. Now your experiment is on the web!


## Create an AWS Account

1.    Create an Amazon Web Services (AWS) account at https://aws-portal.amazon.com/gp/aws/developer/registration/index.html.
2.    Sign up for an Amazon Mechanical Turk Requester account at the https://requester.mturk.com/.
3.    Download and install Java Runtime Environment (JRE) from: http://www.oracle.com/technetwork/java/javase/downloads/index.html.
4.    Download and unzip Amazon Mechanical Turk Command Line Tools from https://requester.mturk.com/developer/tools/clt
5. Go to https://aws.amazon.com/ and log into your AWS account.
Click on your name and then `My Security Credentials'.
Click on `Get started wih IAM Users'.
Click on `Add User'.
5.    Follow our instructions to generate an MTurk access key.
6.    At the place where you have unzipped the Command Line Tools, there should be a folder `aws-mturk-clt-...`.
7.    Inside this folder, there is a `/bin` directory, inside which there is a file called `mturk.properties`. Open this file in a text editor.
8. Add the lines
```
access_key=ACCESS_KEY_ID_FROM_PREVIOUS_STEP
secret_key=SECRET_KEY_FROM_PREVIOUS_STEP
```
pasting the keys from the previous step in the place of the placeholders.
9. The file will also contain a line that will read something like `service_url=https://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester`. Check whether, after `service_url=`, it says `http` or `https`.


## Post it to MTurk

In this section, you will post the experiment to the MTurk Sandbox.

1. To post experiments, you will be using a Python script. If you have not installed Python, you will first need to install it. You can download Python from `https://www.python.org/downloads/`. We recommend downloading 2.7, not 3.6.

1. In the command line, move to the place where you have downloaded the experiment. Execute `git clone https://github.com/feste/Submiterator.git`.

Again, if you have not installed git, you can `https://github.com/feste/Submiterator`, and click on `Clone or download`. Extract the downloaded zip file.

In either case, you will now have a folder called `Submiterator`.

2. Open a text editor and paste the following:

```
    {
    "rewriteProperties":"yes",
    "liveHIT":"no",
    "title":"a title to show to turkers",
    "description":"a description to show to turkers",
    "experimentURL":"https://stanford.edu/~YOUR_SUNET_ID/experiment_template/template/template.html",
    "keywords":"language research stanford fun cognitive science university explanations",
    "USonly?":"yes",
    "minPercentPreviousHITsApproved":"95",
    "frameheight":"650",
    "reward":"0.00",
    "numberofassignments":"1",
    "assignmentduration":"1800",
    "hitlifetime":"2592000",
    "autoapprovaldelay":"60000",
    "conditions":"cond"
    }
```

In the sixth line, replace `YOUR_SUNET_ID` with your SUNET ID.

Save this file in the `Submiterator` directory that you have, giving it a name ending in `.config`, such as `my-first-experiment.config`.

3. Run the following commands:
```
export MTURK_CMD_HOME=PATH_WHERE_YOU_HAVE_UNZIPPED_AWS_CLT/aws-mturk-clt-1.3.4
export JAVA_HOME=PATH_OF_YOUR_JAVA_RUNTIME_ENVIRONMENT
```
The PATH_OF_YOUR_JAVA_RUNTIME_ENVIRONMENT might be `/usr`.

The first one tells the Python script where to look for the AWS Command Line Tools, the second one makes sure the Java programs contained in it can be executed.

3. Open the command line and navigate into the `Submiterator` directory. Run the following command
```
    python submiterator.py posthit my-first-experiment
```

4. To get the results:
```
    python submiterator.py getresults my-first-experiment
```

5. To get a list of results by trials, run
```
    python submiterator.py reformat my-first-experiment
```

which will generate a set of `.tsv` files.

# Some Instructions for Building off this Template

Inside the _shared are some helper js files, some libraries we call. Some of these are completely external, like jquery and raphael, some of them are written by members of the lab, like mmturkey and utils.

Inside your javascript file for your own experiment, e.g. template.js, you'll write up the structure that the slides have. In template.js, the line

    exp.structure=["i0", "instructions", "familiarization", "one_slider", "multi_slider", 'subj_info', 'thanks'];

defines the logical flow of the experiment. Always start with i0 (the consent slide) and move on from there. The functions that use this structure to navigate through the experiment are in stream-V2.js and exp-V2.js.  Each slide has several parts:

1. the code in the `start` function is run at the beginning of that block
2. if there is a `present` data structure (which can be a list of objects of any kind), each of these will be passed in, one at a time, to `present_handle`, for each trial in that block
3. `present_handle` has the parameter `stim` from the `present` data structure, and this code is run at the beginning of every trial.
4. the code in `button` is called directly from the html where the button is defined. `_s` always refers to the current slide, so you can reference any function you define as a property of the slide by using the `_s.FUNCTION_NAME()` syntax.
2. the `end` function is run at the end of the block
6. you can define any other functions you want inside the slide and call them either with `this.FUNCTION_NAME` or `_s.FUNCTION_NAME()`.

We've provided a progress bar, which required that you calculate the total number of questions in your experiment (just run `exp.nQs = utils.get_exp_length();` inside the `init` function, at some point after `exp.structure` is defined). Turkers like this a lot.
