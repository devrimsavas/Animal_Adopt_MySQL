//this file contains the sequelize RAW SQL queries for the database
// client handler for sequelize queries
//  i prefer to keep functions as template for further development. 



function sqlQuery1() {
    console.log("test");
}

function sqlQuery2() {
    console.log("test");
}
function sqlQuery3() {
console.log("test");
    
}

function allAnimals() {
    console.log("test");
}

//all animals in date range 


function sqlQuery4() {
  Swal.fire({
      title: 'Select Date Range',
      html: `<input type="date" id="start" class="swal2-input" placeholder="Start date">
             <input type="date" id="end" class="swal2-input" placeholder="End date">`,
      focusConfirm: false,
      preConfirm: () => {
          const startDate = document.getElementById('start').value;
          const endDate = document.getElementById('end').value;
          if (!startDate || !endDate) {
              Swal.showValidationMessage(`Please select both start and end dates`);
              return false;
          }
          return { startDate, endDate };
      }
  }).then((result) => {
      if (result.isConfirmed && result.value) {
          const { startDate, endDate } = result.value;
          window.location.href = `/animals/date-range?start=${startDate}&end=${endDate}`;
      }
  });
}




   

    
