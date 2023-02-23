# interview_creation_portal
Interview Creation Portal

Description
Create a simple app where admins can create interviews by selecting participants, interview start time and end time

Basic Requirements
1.	An interview creation page where the admin can create an interview by selecting participants, start time and end time. Backend should throw error with proper error message if: 
a.	Any of the participants is not available during the scheduled time (i.e, has another interview scheduled)
b.	No of participants is less than 2
2.	An interviews list page where admin can see all the upcoming interviews.
3.	An interview edit page where admin can edit the created interview with the same validations as on the creation page.
Note:
●	No need to add a page to create Users/Participants. Create them directly in the database
●	No need to develop login/signup pages, just make an assumption that only admins will be accessing it and just try to cover the basic requirements part with this assumption.
●	There can be multiple participants in an interview, for eg: Group discussion kind of round

Good to haves
1.	Send emails to participants on interview creation/modification.
2.	Create your app’s frontend as a SPA
