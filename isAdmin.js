//it is middleware function for animal per size  

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Access Denied</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  background-color: #f4f4f4; 
                  text-align: center; 
              }
              h1 { 
                  color: #333; 
              }
              p { 
                  margin: 20px auto; 
              }
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
              }
              .btn:hover {
                  background-color: #0056b3;
              }
          </style>
      </head>
      <body>
          <h1>Access Denied</h1>
          <p>Only admins are allowed to access this page.</p>
          <a href="javascript:history.back()" class="btn">Go Back</a>
      </body>
      </html>
    `);
  }
}

module.exports = isAdmin;



  