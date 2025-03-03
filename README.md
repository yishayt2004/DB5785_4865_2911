# DB5785

# Database Workshop: Progress DB in Docker 🗄️🐋

Welcome to the **Database Workshop** project! This repository contains the summary and resources from a hands-on workshop that covers the end-to-end process of designing, building, and interacting with a **Progress DB** inside a Docker container.

In this workshop, we will explore everything from creating an **Entity-Relationship Diagram (ERD)** to writing **SQL queries**, creating **stored procedures**, defining **views**, and working with **tables**. 

## 🧑‍🏫 Workshop Summary

The goal of this workshop is to introduce key database concepts and hands-on practice in a controlled, containerized environment using Progress DB within Docker.

### Key Concepts Covered:

1. **Entity-Relationship Diagram (ERD)**:
   - Designed an ERD to model relationships and entities for the database structure.
   - Focused on normalizing the database and ensuring the schema was optimized for scalability.

2. **Creating Tables**:
   - Translated the ERD into actual tables, defining columns, data types, primary keys, and foreign keys.
   - Utilized SQL commands for table creation.

3. **Generating Sample Data**:
   - Generated sample data to simulate real-world scenarios using **SQL Insert Statements**.
   - Used scripts to automate bulk data insertion for large datasets.

4. **Writing SQL Queries**:
   - Practiced writing **SELECT**, **JOIN**, **GROUP BY**, and **ORDER BY** queries.
   - Learned best practices for querying data efficiently, including indexing and optimization techniques.

5. **Stored Procedures and Functions**:
   - Created reusable **stored procedures** and **functions** to handle common database tasks.
   - Used SQL to manage repetitive operations and ensure better performance.

6. **Views**:
   - Created **views** to simplify complex queries and provide data abstraction.
   - Focused on security by limiting user access to certain columns or rows.

7. **Progress DB with Docker**:
   - Set up a Docker container to run the **Progress Database**.
   - Configured database connections and managed data persistence within the containerized environment.

---

## 🚀 Getting Started

### Prerequisites

Before starting, make sure you have the following installed on your machine:

- Docker (for running the container)
- A terminal or command prompt
- Basic knowledge of SQL and databases
- Progress DB Docker image (available via Docker Hub)

### Setting Up the Docker Container

To run Progress DB in a Docker container, follow these steps:

1. **Pull the Docker Image**:
    ```bash
    docker pull progressdb/progress-db:latest
    ```

2. **Run the Docker Container**:
    ```bash
    docker run --name progressdb -d -p 1433:1433 progressdb/progress-db:latest
    ```

3. **Access the Container**:
    ```bash
    docker exec -it progressdb bash
    ```

4. **Start the Database Client**:
    - You can now connect to the Progress DB inside the container using the `SQL Explorer` or a database client of your choice.

---

## 📝 Workshop Files & Scripts

### ERD Design
- A diagram representing the database structure with entities and their relationships.
- [ERD Diagram (Link to your image or file)]

### SQL Scripts
- Scripts for creating tables, inserting sample data, writing queries, and defining stored procedures.
- [SQL Scripts Folder (Link to folder or files)]

### Docker Setup
- Instructions and scripts for setting up Progress DB in a Docker container.
- [Docker Setup Instructions (Link to Dockerfile or script)]

### Example Queries & Stored Procedures
- SQL code examples for common operations and stored procedure definitions.
- [Example SQL Queries (Link to folder or files)]

---

## 💡 Workshop Outcomes

By the end of this workshop, you should be able to:

- Design and create a database schema based on an ERD.
- Perform CRUD (Create, Read, Update, Delete) operations with SQL.
- Write complex queries using joins, aggregations, and subqueries.
- Create and use stored functions and procedures for automation and performance.
- Work effectively with Progress DB inside a Docker container for development and testing.

---

## 🔧 Technologies Used

- **Progress DB**: A relational database used in this workshop.
- **Docker**: Containerized environment for isolating and running the database.
- **SQL**: Language used for database manipulation and interaction.
- **ERD**: Tool for database schema design.

---

## 📘 Further Learning

If you want to continue learning about databases, SQL, and containerization, here are some resources you might find useful:

- [Progress DB Documentation](https://docs.progress.com/)
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [Docker Documentation](https://docs.docker.com/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Contributing

Feel free to fork this repository, make improvements, and create pull requests. All contributions are welcome!

---

Happy coding! 🚀
