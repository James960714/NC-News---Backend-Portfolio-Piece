# Northcoders News API

Welcome to my Northcoders Backend Project. What you will see is the backend for a reddit style programme. The program consists of Users, Articles, Comments and Topics. It is a place where people can signup, write articles and also write comments and vote on other articles.
The frontend repo for this back end can be found here... https://github.com/James960714/nc-news  

**The Database**
The database consists of data on the following sections; Users, Articles, Comments and Topics. 

**The Endpoints**
Please see the endpoints.json file for a list of all the endpoints created, their description and what format you can expect to be returned when accessed. This is also a list of any requests you might want to have a look at in terms of the API's functionality. 

**Hosted Backend**
The backend is hosted at this path on render (https://nc-news-backend-portfolio-piece.onrender.com/api/users) if you wish to try making requests through your chosen API client. I used Insomnia (https://insomnia.rest/download)) for some testing when setting up the backend.

For viewing in a local environment and reviewing code & tests; please follow the instruction in the next section. 

**Setup**

Ahead of reviewing the backend code there is some setting up needed. 

1. Cloning:
    - select 'Code' on https://github.com/James960714/NC-News---Backend-Portfolio-Piece
    - copy down the https path
    - find a good location on your local device and git clone the project there
  
2. Packages:
There are a variety of packages used in this project for the testing, API functionality and databases.
As a minimum you will need Node.js v21.7.1 for this project. 

   **Testing:**
   -  jest: For testing purposes jest has been used.
       - To install: npm i -D jest   
   -  jest-extended & jest-sorted: For more specified testing and additional matchers, jest-extented and jest-sorted have been included in the testing packages.
       - To install jest-extended: npm i -D jest-extended
       - To Install jest-sorted: npm i -D jest-sorted  
   -  husky: This is an optional dependency. When pushing branches up I made use of the husky pre-commit hook to make sure the code was working ahead of finalising the commit.
       - To install husky: npm i -D  husky
       - The relevant husky files should be ready to use but in case it's not running properly run: npx husky init. 
   -  supertest: Used for testing HTTP
       - To install: npm i -D supertest
         
    **API:**
   -  express: Used for building the API.
       - To install: npm i express
   -  cors: Cors allows us to make requests to the backend from different origins for example in this project's case it is requests being made by the frontend.
       - To install: npm i cors

   **Database:**
    This project used PostgreSQL (minimum version needed is: psql (PostgreSQL) 14.11) for it's databases, so as a starting point this will need to be downloaded. Please find download link here... https://postgresapp.com/
   
    Now that this is installed we can move onto the relevant database packages needed:
   -  node-postgres: Used for interfacing with the the PostgreSQL databases.
       - To install: npm i pg 
   -  node-pg-format: Used in the data seeding stage for dynamically creating an SQL query to upload the range of data we have e.g. multiple articles all with the same properties but different values.
       - To install: npm i pg-format     
   -  dotenv: To set up the test and development databases connections dotenv has been used.
       -   To install: npm i -D dotenv
       -   Setting up database connections:

                Create 2 .env files; one for the test database connection and one for the development databease connection. If not already installed please install the npm package 'Dotenv'. Instructions of how to do so are found here... https://www.npmjs.com/package/dotenv#-install 
                
                    Once installed add the following files to the main directory:  
                
                        + Test database .env file name **.env.test**
                            - PGDATABASE=nc_news_test
                
                        + Development database . env file name **.env.development**
                            - PGDATABASE=nc_news

     
3. Database setup and Seeding:

   Once the all above has been installed head to your terminal and run the following command: npm run setup-dbs

   **Development Data**
   If you wish to use the development data run the command: npm run seed

   **Test data**:
   When running the tests the test data base is seeded before each test; so runnign the following command will seed the data for each test:
   npm run test. 

    Both sets of data can be seen in full in BE-NC-NEWS/db/data







This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)




