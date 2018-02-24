# Instructions

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
