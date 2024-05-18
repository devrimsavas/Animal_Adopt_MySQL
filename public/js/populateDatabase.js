async function populateDatabase() {
    try {
      const response = await fetch('/populate-animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const message = await response.text(); // Handle text response
      const dbMessageElement = document.getElementById('dbMessage');
      if (response.ok) {
        dbMessageElement.innerText = message; // Show success message
        dbMessageElement.classList.add('text-success');
      } else {
        throw new Error(message || 'Failed to populate the database.');
      }
    } catch (error) {
      console.error('Error populating the database:', error);
      document.getElementById('dbMessage').innerText = 'Error populating the database. It seems it is already populated. Please check the console for more details.';
      document.getElementById('dbMessage').classList.add('text-danger');
      //sweetalert
      Swal.fire({
          title:"Populate Database Error",
          text:"Error populating the database. It seems you have already populated the database. Please check the console for more details.",
          icon:"warning"
      })

    }
  }