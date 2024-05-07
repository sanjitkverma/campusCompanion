# Campus Companion

## Introduction
Campus Companion is an application designed to enrich campus life through integrated educational tools and streamlined services. The architecture of Campus Companion is distributed across Docker containers for a seamless transition from development to production.

### For full deployment instructions please take a look at our [Deployment Guide](https://github.ncsu.edu/engr-csc-sdc/2024SpringTeam30-Entrepreneurs/blob/main/Team%2030%20Deployment%20Guide.pdf)

## Application Architecture
Campus Companion is composed of:
- **API Server Container**: Manages backend logic and data processing.
- **Front-end UI Container**: Delivers the user interface, serving static content and handling interactions.
- **Shibboleth Authentication Container**: Ensures secure user authentication.
- **generate.py**: A Python program to populate the database for the chat system.

## Requirements for Setup
To deploy/run Campus Companion, ensure the following:
- Access to a Virtual Computing Environment (VCE) like VCL or a cloud-based instance.
- A MongoDB database setup with a `MONGO_URI` connection string.
- A `.env` file with all necessary environment variables in the /api folder.</br>
MODEL=gpt-3.5-turbo </br>
OPENAI_API_KEY= 'ENTER API KEY'</br>
SENDGRID_API_KEY=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</br>
MONGO_URI=mongodb+srv://user:password@campuscompanion.emw2a4f.mongodb.net/?retryWrites=true&w=majority</br>
MONGODB_DATABASE=campusCompanion_DATABASE</br>
MONGODB_VECTORS= MONGODB_VECTORS</br>
MONGODB_VECTOR_INDEX= MONGODB_VECTOR_INDEX</br>
MONGODB_USERS= MONGODB_USERS</br>
MONGODB_SYLLABI= MONGODB_SYLLABI</br>

- Docker and Docker Compose installed on the VCE.

## Running the System
To run Campus Companion, complete the following:
- cd to the campusCompanion folder and run docker compose up --build
- navigate to https://localhost

## Troubleshooting Guide
Common issues may involve:
- Docker Container failures: Verify configurations, environment variables, and system resources.
- Database Connectivity Issues: Double-check MongoDB URI and network access.
- Authentication Errors: Check Shibboleth configurations and credentials.
- SSL/TLS Certificate Issues: Use SSL Test tools and verify certificate installation and renewal.

## Verification Plan
Ensure the proper operation by:
- Checking website accessibility.
- Testing login functionality.
- Navigating key pages.
- Verifying database connectivity and security features.

Technical verification includes API response checks and log reviews, with logs found at `var/www/2024SpringTeam30-Entrepreneurs/campuscompanion/logs/`.


---
For any additional help or clarification, please reach out to the Campus Companion development team.


<table>
  <tr>
    <td align="center"><a href="https://github.ncsu.edu/skverma"><img src="https://avatars.githubusercontent.com/sanjitkverma" width="100px;" alt=""/><br /><b>Sanjit Verma</b></a></td>
    <td align="center"><a href="https://github.ncsu.edu/asharm52"><img src="https://avatars.githubusercontent.com/arul28" width="100px;" alt=""/><br /><b>Arul Sharma</b></a><br /></td>
    <td align="center"><a href="https://github.ncsu.edu/ssomasu"><img src="https://avatars.githubusercontent.com/Harris-A-Khan" width="100px;" alt=""/><br /><b>Sarvesh Soma </b></a><br /></td>
    <td align="center"><a href="https://github.ncsu.com/mymeles"><img src="https://avatars.githubusercontent.com/Sarvesh-Somasundaram" width="100px;" alt=""/><br /><b>Meles Meles</b></a><br /></td>
     <td align="center"><a href="https://github.ncsu.com/snain"><img src="https://avatars.githubusercontent.com/Sarvesh-Somasundaram" width="100px;" alt=""/><br /><b>Sanket Nain</b></a><br /></td>
