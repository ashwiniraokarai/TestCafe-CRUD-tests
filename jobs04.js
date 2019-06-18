/*
//In the next exercise, we add a test for executing the last CRUD operation i.e, Deleting a job
*/

import { Selector } from 'testcafe';

//Selectors that will be used across this and other tests

//Collected from All Jobs
const MAIN_HEADING = Selector("h1"); //All Jobs (heading or any h1 on the current page
const ADD_JOB_BTN = Selector("a.btn.btn-primary"); //Add New Job (Button)
const JOBS_TABLE_ROWS = Selector("tbody > tr"); //Table rows

//Collected from Add Job
const JOB_TITLE_INPUT = Selector("input#title.form-control");
const JOB_DESC_INPUT = Selector("textarea#description.form-control");
const JOB_COMPANY_NAME_INPUT = Selector("input#company.form-control");
const JOB_EMAIL_INPUT = Selector("input#email.form-control");
const SUBMIT_BTN = Selector("button.btn.btn-primary").withText("Submit");

//Collected from Delete Job


fixture("Node jobs").page("http://localhost:3000");

test("List all jobs", async (t) =>{
	//Write code to ensure that the page all the contents you expect (list of jobs)
	
	//Validate the Heading text
	//Selector("h1").innerText
	
	await t.expect(MAIN_HEADING.innerText).eql("All Jobs");
	
	//Validate Add New Job button
	//Selector("a.btn.btn-primary").innerText
	await t.expect(ADD_JOB_BTN.innerText).eql("Add New Job");
	
	//Validate Table Rows count (this isn't a smart thing to do coz the count will keep varying depending on state). In reality you'll want a counter to track the count and use it to compare with, rather than use a static number.
	//Selector(tbody > tr)
	await t.expect(JOBS_TABLE_ROWS.count).eql(3);
	
	//Validate that a job with text "Horse Whisperer" exists (again, not a smart thing to do, but a good chance to learn automated validation)
	await t.expect(JOBS_TABLE_ROWS.withText("Horse Whisperer").exists).ok();

});


//Add another test to the fixture is no different than the first test we added earlier. Only this time will append a ".only" to additionally demonstrate  how to limit the tests in the fixture that we want to run (this is soooo useful!)
test("Add Job", async (t) => {
	
	await t.click(ADD_JOB_BTN);
	//Click the Add Job button (turns out add job selector is existing as a result of code refactor on previous test and thus can be reused)
	
	//Confirm you are on the Add Job page by validating the heading (turns out h1 selector is existing as a result of code refactor on previous test and thus can be reused. Only the value we are comparing with i.e, "eql" value needs to be adjusted)
	await t.expect(MAIN_HEADING.innerText).eql("Add Job");
	
	//Enter Title (new selector)
	await t.typeText(JOB_TITLE_INPUT,"SDET");
	
	//Enter Desc (new selector)
	await t.typeText(JOB_DESC_INPUT,"I am a QA SME on my way advancing to an SDET!");
	
	//Enter Company  (new selector)
	await t.typeText(JOB_COMPANY_NAME_INPUT,"Undisclosed");
	
	//Enter Email (new selector)
	await t.typeText(JOB_EMAIL_INPUT,"anamika@email.com");
	
	//Click Submit button (new selector)
	await t.click(SUBMIT_BTN); //Turns out Submit button is reused on Update Jobs page. So, moved the selector constant outside of this test
	
	//Validate that the job got added successfully (i.e, the job should list on the All Jobs home page) 
	await t.expect(MAIN_HEADING.innerText).eql("All Jobs");
	await t.expect(JOBS_TABLE_ROWS.withText("SDET").exists).ok();
}
);

//Write a test with an ".only if you are testing the test for for the first time and therefore would want it to run in isolation
test("Update a specific job", async (t) => {
	//Locate the job (table row) you recently added (using the specific text/ job title). You can use the existing selector JOBS_TABLE_ROWS and use withText to locate the specific job: JOBS_TABLE_ROWS.withText("SDET")
	
	//Find the update button associated with the table row that was located in the previous step
	//JOBS_TABLE_ROWS.find("a.btn.btn-warning.btn-sm")
	
	//Hit the Update Button
	await t.click(JOBS_TABLE_ROWS.withText("SDET").find("a.btn.btn-warning.btn-sm"));
	
	//Confirm you are on the Update Job page 
	await t.expect(MAIN_HEADING.innerText).eql("Update Job");
	
	//Update all values just like you'd enter new text to a blank using typeText except that you'll want to state {replace: true}  so the text is overwritten and not appended. If the options parameter is left omitted !
	//Enter Title (new selector)
	await t.typeText(JOB_TITLE_INPUT,"Software Developer in Test",{ replace: true });
	
	//Enter Desc (new selector)
	await t.typeText(JOB_DESC_INPUT,"QA or Developers are both welcome to apply!",{ replace: true });
	
	//Enter Company  (new selector)
	await t.typeText(JOB_COMPANY_NAME_INPUT,"Tech Up",{ replace: true });
	
	//Enter Email (new selector)
	await t.typeText(JOB_EMAIL_INPUT,"jobs@techup.com",{ replace: true });
	
	//Hit Submit (reusing existing Selector)
	await t.click(SUBMIT_BTN);
	
	//Ensure you are back on the All Jobs page
	await t.expect(MAIN_HEADING.innerText).eql("All Jobs");
	
	//Check that the original job does not exist (using notOk()) because it got updated
	await t.expect(JOBS_TABLE_ROWS.withText("SDET").exists).notOk();
	
	//Check that the updated job exists
	await t.expect(JOBS_TABLE_ROWS.withText("Software Developer in Test").exists).ok();
	
});


test("Delete Job",async (t) => {
	//Locate the job (table row) with the job title that you'd like to delete. You can do this by reusings JOBS_TABLE_ROWS withText(<job you want to delete>)
	//Find the associated job's delete button. You can achieve this by running a find for the delete button on the JOBS_TABLE_ROWS withText
	//Click the delete button
	//A JS alert (native dialog, categorically defined as type "confirm") will trigger asking to confirm deletion (ok/ cancel buttons). The alert is accessible via setNativeDialogHandler() function to which you can pass your handler function that performs the desired action
	
	//ONE weird thing is that the setdialog needs to be SET AHEAD of its workflow, i.e., before clicking the Delete button, even though as per the visual flow the dialog appears AFTER clicking Delete. If you write code the other way, interestingly the deletion is successful but you'll be thrown an error: "A native confirm dialog was invoked on page "http://localhost:3000", but no handler was set for it. Use the "setNativeDialogHandler" function to introduce a handler function for native dialogs.)"    ....and the test execution terminates soon after the successful deletion step.
	
	await t.setNativeDialogHandler(() => true);
	await t.click(JOBS_TABLE_ROWS.withText("Software Developer in Test").find("a.btn.btn-danger.btn-sm"));
	
	//Verify that the deleted job does not exist on the All Jobs listing 
	await t.expect(MAIN_HEADING.innerText).eql("All Jobs");
	
	await t.expect(JOBS_TABLE_ROWS.withText("Software Developer in Test").exists).notOk();
});

//To test the cancel scenario set the setNativeDialogHandler(() => true) to false!