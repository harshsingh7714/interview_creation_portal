// function getParticipants() {
//     return fetch('/participants')
//       .then(response => response.json());
//   }
  
//   function populateParticipantsSelect(participants) {
//     const participantsSelect = document.querySelector('#participants');
//     participants.forEach((participant) => {
//       const option = document.createElement('option');
//       option.value = participant.id;
//       option.textContent = participant.name;
//       participantsSelect.appendChild(option);
//     });
//   }
  
//   function createInterview(interview) {
//     return fetch('/interviews', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(interview)
//     })
//       .then(response => response.json());
//   }
  
//   function handleSubmit(event) {
//     event.preventDefault();
//     const form = event.target;
//     const start_time = form.elements.start_time.value;
//     const end_time = form.elements.end_time.value;
//     const participants = Array.from(form.elements.participants.selectedOptions).map(option => parseInt(option.value, 10));
//     createInterview({ start_time, end_time, participants })
//       .then((interview) => {
//         alert(`Interview ${interview.interview_id} created`);
//         form.reset();
//       })
//       .catch((error) => {
//         console.error(error);
//         alert('Error creating interview');
//       });
//   }
  
//   document.addEventListener('DOMContentLoaded', () => {
//     getParticipants()
//       .then((participants) => {
//         populateParticipantsSelect(participants);
//       });
//     const form = document.querySelector('interviews');
//     form.addEventListener('submit', handleSubmit);
//   });
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  fetch('/interviews', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});
