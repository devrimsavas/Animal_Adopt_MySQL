

# Application Installation and Usage Instructions
Application Installation and Usage Instructions
It is  web-based animal adoption application. This document provides basic instructions on how to install and use the application. Follow these steps to get started:
Installation
1.	Clone the Repository: Begin by cloning the repository to your local machine.
2.	Install Dependencies: Navigate to the root directory of the project in your terminal and run npm install to install all required dependencies.
3.	Environment Configuration: Ensure you have a .env file at the root of your project with all necessary environment variables set. This should include your database configurations. Make sure to include require('dotenv').config(); in your www file to load these configurations.
4.	Database Setup: To initialize the database and populate it with initial data, ensure your app.js file includes the following line: db.sequelize.sync({ force: true }).then(() => { console.log('Database and tables created!'); });. This line will drop all existing tables and recreate them, so use it with caution.
Usage
1.	Starting the Application: Start the application by running npm start. This will launch the server on localhost:3000.
2.	Populating the Database: Upon first running the application, navigate to the main page at localhost:3000. Here, you should press the "Populate" button to create database tables and populate them from predefined JSON files. The tables will be created automatically.
3.	Guest Users: Guest users can browse the animals and most of the application's features without the ability to adopt or cancel an adoption.
4.	Admin Users: Admin users have the ability to cancel adoptions, add new temperaments, and add new species. This elevated access is controlled through user roles within the application


# Environment Variables

To ensure the application runs smoothly, you must configure your environment variables correctly. Please follow these steps to set up your .env file:
1.	Create a .env File: In the main folder of your project, create a file named .env. This file will store your environment variables.
2.	Add Variables to .env File: Copy and paste the following variables into your .env file, making sure to replace the placeholder values with your actual configurations if necessary:

ADMIN_USERNAME="dabcaowner" 
ADMIN_PASSWORD="dabca1234" 
DATABASE_NAME="adoptiondb" 
DIALECT="mysql" 
DIALECTMODEL="mysql2" 
PORT="3000" 
HOST="localhost" 
These variables are essential for the application's operation, including database access and administrative functions.





# Additional Libraries/Packages

This application utilizes a variety of libraries and packages to facilitate web development, enhance security, manage user sessions, and interact with databases. Below is an overview of the key dependencies included in the **package.json** file:

-   **Express**: A fast, unopinionated, minimalist web framework for Node.js, essential for handling HTTP requests and structuring the application.
-   **EJS**: A templating language that lets you generate HTML markup with plain JavaScript, providing an efficient way to render dynamic content on web pages.
-   **Sequelize**: A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server. It supports transactions, relations, eager and lazy loading, read replication, and more.
-   **Passport**: Simple, unobtrusive authentication for Node.js. This application uses the **passport-local** strategy for authentication with a username and password.
-   **MySQL/MySQL2**: These packages are used for interacting with MySQL databases, allowing the application to store and manage data efficiently.
-   **SQLite3**: Provides a lightweight disk-based database that doesn't require a separate server process, used for development purposes.
-   **Dotenv**: Loads environment variables from a **.env** file into **process.env**, securing application configuration.
-   **Bcrypt**: A library to help you hash passwords, enhancing the security of user information.
-   **Connect-flash**: A middleware for Express that uses a portion of the session for storing messages, useful for passing session flashdata messages.
-   **Express-session**: Simple session middleware for Express, allowing session management capabilities.
-   **Connect-sqlite3**: SQLite3 session store backed by **sqlite3**, used for storing session data.

For enhancing user experience, **SweetAlert** has been integrated to provide aesthetically pleasing alert messages, confirmations, and prompts.

Additionally, while **bcrypt** and **connect-flash** have been included in the project, they are intended for future development to enhance security and user feedback mechanisms. Currently, authentication is managed using **Passport** with a simple username and password strategy.






# NodeJS Version Used

This project is built with NodeJS version 20.10.0. It is crucial to use this version or higher to ensure compatibility with all dependencies and project functionalities.

To check if you have Node.js installed and determine your current version, open your terminal or command prompt and run the following command:



`node -v`

This command will display the version of Node.js that is currently installed on your system. If you see a version that is 20.10.0 or higher, you're all set to run this application. If you do not have Node.js installed or if your version is lower than 20.10.0, you will need to install or update it.

To install or update Node.js to the latest version, you can download it from the official Node.js website (<https://nodejs.org/>).





# DATABASE


For this project, you will need to set up a MySQL database to manage the data. Follow the steps below to create the required database and user with the necessary permissions.

Create the Database: First, you need to log in to your MySQL server using MySQL Workbench, the command line, or any other MySQL client you prefer. Once logged in, execute the following SQL command to create a new database named `adoptiondb`:

   

    `CREATE DATABASE adoptiondb;`


# DATABASEACCESS

for database access , follow the steps below
1.  Grant Permissions: After creating the new user, you need to grant it the necessary permissions to access and modify the `adoptiondb` database. Execute the following command to grant all permissions on the `adoptiondb` database to the `dabcaowner` user:

    

    `GRANT ALL PRIVILEGES ON adoptiondb.* TO 'dabcaowner'@'localhost';`

2.  Apply the Changes: To ensure the permissions are applied immediately, execute the following command:

    

    `FLUSH PRIVILEGES;`


