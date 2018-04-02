# Software installation for Linguist 245 (Spr 2018)

## Git & GitHub

Git is a version-control system and GitHub is a platform to host your projects.

1. [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). You can read the rest of the linked tutorial to learn more about git.
2. [First time Git setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup): The main thing is to configure `user.name` and `user.email`
3. [Sign up for a GitHub account](https://github.com/)

Fork your project

## Install R & RStudio

R is a programming language widely used for statistical computing.
RStudio is a powerful IDE (Integrated Development Environment) we will be working with
in this course.

1. [Install R](https://cran.cnr.berkeley.edu/)
2. [Install RStudio](https://www.rstudio.com/products/rstudio/download/)
3. Install the `tidyverse` package: Lauch RStudio and run in the console: `install.packages("tidyverse")`  
**(Note that quotes are needed when you install packages)**
4. You need to load the package before you can use it:
`library(tidyverse)`  
**(Note that there are NO quotes when you load packages)**  
If you see a list of attached packages (including `ggplot2`, `dplyr` etc) then everything is good. (Don't worry about the conflicts printed afterwards.)

## Install Python 2 & Java

In this course we will not directly program in Python or Java, but some software we use depends on them, so make sure you [have installed Python 2](https://www.python.org/downloads/release/python-2714/) (**even if you have installed Python 3, as it is not backward compatible!**).

As for Java, download and install Java Runtime Environment (JRE) from: http://www.oracle.com/technetwork/java/javase/downloads/index.html


## Amazon MTurk Setup

Amazon Mechanical Turk (MTurk) is a crowdsourcing platform well suited for running web-based experiments.

1.    Create an Amazon Web Services (AWS) account at https://aws-portal.amazon.com/gp/aws/developer/registration/index.html.
2.    Sign up for an Amazon Mechanical Turk Requester account at the https://requester.mturk.com/.
2.    Now you will link your AWS Account and your MTurk Requester Account. Open https://requester.mturk.com/developer, and click `Link your AWS Account`. Then sign-in with your AWS Root user email address and password.
3. Repeat the above two steps to create and link
 a MTurk sandbox account
 https://requestersandbox.mturk.com/
4.    Download and unzip Amazon Mechanical Turk Command Line Tools from https://requester.mturk.com/developer/tools/clt
5. Go to https://aws.amazon.com/ and log into your AWS account.
Click on your name and then `My Security Credentials`.
Click on `Get started wih IAM Users`.
Click on `Add User`.
5.    Follow our instructions (see email) to generate an MTurk access key.
6.    At the place where you have unzipped the Command Line Tools, there should be a folder `aws-mturk-clt-...`.
7.    Inside this folder, there is a `/bin` directory, inside which there is a file called `mturk.properties`. Open this file in a text editor.
8.  There should be lines
```
access_key=[insert your access key here]
secret_key=[insert your secret key here]
```
Paste the keys from the previous step in the place of the placeholders.
9. Save the file. Important: This file now contains your secret key, and anyone having this file can post HITs in your name. It might be reasonable to remove the keys once you're done and generate new keys when you do your next experiment.
