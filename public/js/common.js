


//here start adopt animal part -----------------------------



function adoptAnimal(id) {
    // Use SweetAlert for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to adopt this animal?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, adopt it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Only proceed if the user confirmed
        fetch(`/animals/adopt/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json()) // Always parse the response as JSON
        .then(data => {
            if (data.message) {
                // Use SweetAlert to display the message
                Swal.fire(
                  'Adopted!',
                  data.message,
                  'success'
                );
                location.reload();
            } else {
                throw new Error('Unknown error occurred');
            }
        })
        .catch(error => {
            console.error("Error adopting animal:", error);
            Swal.fire(
              'Error!',
              'An error occurred. Please try again. You need to be logged as an user to perform this action.',
              'error'
            );
        });
      }
    });
  }

//name is confusing this function deletes adoptation status not ANIMAL


function deleteAnimal(id) {
    // Use SweetAlert for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel the adoption of this animal?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        fetch(`/animals/cancelAdoption/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include credentials to ensure the session cookie is sent with the request
            'credentials': 'include'
          },
        })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            // Display success message with SweetAlert
            Swal.fire(
              'Cancelled!',
              data.message,
              'success'
            );
            location.reload(); // Reload the page to reflect the changes
          } else {
            throw new Error(data.error || 'Unknown error occurred');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Display error message with SweetAlert
          Swal.fire(
            'Failed!',
            'Failed to cancel the adoption. You need to be logged as an admin to perform this action.',
            'error'
          );
        });
      }
    });
  }


//here starts the species part-------------------


//add new species 
function addNewSpecies(event) {
    event.preventDefault(); // Prevent the form from submitting.

    // Using SweetAlert for input
    Swal.fire({
        title: 'Enter new species name:',
        input: 'text',
        inputPlaceholder: 'New species name',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Species name cannot be empty!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const newSpeciesName = result.value;

            fetch('/species/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Necessary for sessions to work.
                body: JSON.stringify({ name: newSpeciesName }) // Send the new species name to the server.
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire('Added!', 'New species added successfully.', 'success').then(() => {
                        window.location.reload(); // Reload the page to see the new species.
                    });
                } else {
                    response.json().then(data => {
                        Swal.fire('Failed!', data.error || 'Failed to add the species.', 'error');
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire('Error!', 'An error occurred. Please try again.', 'error');
            });
        }
    });
}

//update species

function updateSpecies(id) {
    Swal.fire({
        title: 'Update species name:',
        input: 'text',
        inputPlaceholder: 'Enter the new species name',
        showCancelButton: true,
        confirmButtonText: 'Update',
        preConfirm: (newName) => {
            if (!newName) {
                Swal.showValidationMessage(`Please enter a species name.`);
                return false; // Prevents proceeding with empty input
            }
            return newName; // Correctly return newName for processing
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) { //  the result is confirmed and has a value
            const newName = result.value; //  extract newName from the result
            fetch(`/species/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: newName }) // Send the updated species name to the server.
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: 'Updated!',
                        text: 'Species updated successfully',
                        icon: 'success'
                    }).then(() => {
                        window.location.reload(); // Reload the page to see the update.
                    });
                } else {
                    Swal.fire('Failed', 'Failed to update the species.You need to be logged as an admin to perform this action', 'error');
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire('Error', 'An error occurred. Please try again.', 'error');
            });
        }
    });
}




function deleteSpecies(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/species/delete/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //  if i have other headers
                },
                credentials: 'include', // Necessary for sessions to work
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire(
                        'Deleted!',
                        'Species deleted successfully.',
                        'success'
                    ).then(() => {
                        window.location.reload(); // Reload the page to update the list
                    });
                } else {
                    Swal.fire(
                        'Failed!',
                        'Failed to delete the species. Either It may have dependencies or You need to be logged as an admin to perform this action.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire(
                    'Error!',
                    'An error occurred. Please try again.',
                    'error'
                );
            });
        }
    });
}

//here starts the Temperament part

//add new temperament


function addNewTemperament(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    Swal.fire({
      title: 'Enter new temperament name:', // Title
      input: 'text', // Type of input
      inputPlaceholder: 'New temperament name', // Placeholder
      showCancelButton: true, // Show cancel button
      inputValidator: (value) => {
        if (!value) {
          return 'Temperament name cannot be empty.';
        }
      }
    }).then((result) => {
      if (result.value) {
        const newTemperamentName = result.value;
        console.log("New temperament name:", newTemperamentName);
  
        // Now, we make the fetch request inside this block
        fetch('/temperament/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Necessary for sessions to work
            body: JSON.stringify({ description: newTemperamentName }) // Send the new temperament name to the server
        })
        .then(response => {
            if (response.ok) {
                Swal.fire("Success", "New temperament added successfully.", "success");
                window.location.reload(); // Reload the page to see the new temperament
            } else {
                response.json().then(data => {
                    Swal.fire("Error", data.error || "Failed to add the temperament.", "error");
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire("Error", "An error occurred. Please try again.", "error");
        });
      }
    });
  }


//update temperament

function updateTemperament(id) {
    Swal.fire({
        title: 'Update Temperament',
        input: 'text',
        inputLabel: 'New Description',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something! can not be empty';
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            let newDescription = result.value; // Use the input value
            fetch(`/temperament/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ description: newDescription })
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Temperament updated successfully',
                        icon: 'success'
                    }).then(() => {
                        window.location.reload(); // Reload the page to see the update
                    });
                } else {
                    Swal.fire({
                        title: 'Failed!',
                        text: 'Failed to update the temperament.',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred. Please try again.',
                    icon: 'error'
                });
            });
        }
    });
}

//delete temperament

function deleteTemperament(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/temperament/delete/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other necessary headers if i wil have 
                },
                credentials: 'include', // Necessary for sessions to work
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire(
                        'Deleted!',
                        'Temperament deleted successfully.',
                        'success'
                    ).then(() => {
                        window.location.reload(); // Reload the page to update the list
                    });
                } else {
                    Swal.fire(
                        'Failed!',
                        'Failed to delete the temperament. It may have dependencies.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire(
                    'Error!',
                    'An error occurred. Please try again.',
                    'error'
                );
            });
        }
    });
}


//sweet alert dialog for prompt function 

function showSweetAlertInputDialog(title, placeholder, callback) {
    Swal.fire({
      title: title,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      inputValidator: (value) => {
        if (!value) {
          return 'This field cannot be empty!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Call the callback function with the input value
        callback(result.value);
      }
    });
  }