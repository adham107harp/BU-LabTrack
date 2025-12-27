# Lab Tracking System

![Lab Tracking System Banner](https://via.placeholder.com/1280x400?text=Lab+Tracking+System) <!-- Replace with actual image URL if available -->

## Overview

The Lab Tracking System is a web-based application designed to manage and monitor laboratory equipment, facilitate tool sharing among students, and optimize research lab bookings. This project aims to enhance laboratory operations by automating equipment tracking, maintenance scheduling, and usage reporting. It supports QR/Barcode scanning, real-time dashboards, role-based access control, notifications, and analytics to improve efficiency, accountability, and transparency while reducing manual errors.

This repository contains the Software Requirements Specification (SRS) document (Version 5.0) and related artifacts. The system is built as part of a Software Engineering project at Badya University, following IEEE Std 830-1998 standards.

Key objectives:
- Efficient monitoring of equipment usage and condition.
- Automated maintenance reminders and alerts.
- Centralized digital records for laboratory assets.
- Enhanced decision-making through reports and analytics.
- Facilitation of tool sharing to reduce redundancy and costs.
- Optimized research lab allocation based on project requirements, availability, and access control.

## Features

The system is divided into three main modules:

### 1. Lab Equipment Tracking
- Registration and tracking of equipment using university email login.
- QR/Barcode integration for quick scanning and updates.
- Maintenance scheduling with automated reminders.
- Real-time dashboard for equipment status, availability, and occupancy.
- Usage and analytics reports on equipment utilization.

### 2. Tool Sharing Module
- Allows students to donate, lend, or borrow lab tools.
- Tracks tool availability, user requests, and borrowing history.
- Encourages resource sharing and reduces unnecessary purchases.

### 3. Research Labs Booking Module
- Enables professors and student groups to reserve labs.
- System recommends suitable labs based on activities, equipment, availability, and access permissions.
- Ensures security with controlled access for specific groups.

Additional System Features:
- Role-Based Access Control (e.g., Admin: Full CRUD; Technician: Maintenance; Staff: Borrowing).
- Notification System (Email/SMS) for confirmations and alerts.
- Backup & Restore for data security.
- Audit Trail & Access Logs for accountability.

## Technologies Used

- **Backend**: Java 21 (JDK 21) with Spring Boot 3.x framework.
- **Frontend**: HTML5, CSS3, JavaScript (responsive design).
- **Database**: MySQL with proper indexing and relational integrity.
- **Other**: QR/Barcode scanners integration, REST API for client-server communication, Git for version control.
- **Dependencies**: The system assumes availability of email/SMS gateways and university network infrastructure.

## Installation and Setup

1. **Prerequisites**:
   - Java JDK 21 or higher.
   - MySQL database server.
   - Git for cloning the repository.

2. **Clone the Repository**:
   ```
   git clone https://github.com/your-username/lab-tracking-system.git
   cd lab-tracking-system
   ```

3. **Database Setup**:
   - Create a MySQL database and import the schema (schema.sql if available in `/db` folder).
   - Update database credentials in `application.properties` (Spring Boot config).

4. **Build and Run**:
   ```
   mvn clean install  # If using Maven
   java -jar target/lab-tracking-system.jar
   ```
   - Access the application at `http://localhost:8080`.

5. **Deployment**:
   - Deploy to a server (e.g., AWS, Heroku) using Spring Boot's embedded Tomcat.
   - Refer to the Installation Guide in the SRS document for detailed steps.

## Usage

- **Admin**: Manage users, equipment, reports, and backups.
- **Technician**: Update maintenance records and equipment status.
- **Staff/Students**: Borrow/return tools, book labs via the dashboard.
- **Professors**: Reserve research labs with system recommendations.

For detailed usage, refer to the User Manual in the SRS appendices.

## Contributors

This project was developed by:
- Rawda Abokhalil
- Nadine Ahmed
- Rewan Ibrahim
- Adham Mohammed
- Sayed Eissa

Under supervision of:
- Dr. Ahmed Maghawry
- Eng. Nouran Mohammed
- Eng. Mohammed Abdouh

## Commit Guidelines

We use Git for version control to ensure clean, traceable development. Follow these best practices for commits:

- **Commit Messages**: Use concise, descriptive messages in the imperative mood (e.g., "Add QR code scanning feature" instead of "Added...").
- **Atomic Commits**: Keep commits small and focused on a single change (e.g., one feature or bug fix per commit).
- **Branching Strategy**: 
  - `main`: Stable production branch.
  - `develop`: Integration branch for features.
  - Feature branches: `feature/<feature-name>` (e.g., `feature/qr-integration`).
  - Bug fixes: `fix/<issue-number>`.
- **Pull Requests**: All changes must go through PRs with reviews. Include references to issues (e.g., "Closes #5").
- **Conventional Commits**: Optionally follow [Conventional Commits](https://www.conventionalcommits.org/) spec (e.g., `feat: add tool sharing module`, `fix: resolve dashboard loading issue`).

Example Commit History (Fictional based on project phases):
- `feat: initialize Spring Boot project structure` (Initial setup).
- `docs: add SRS Version 5.0 PDF` (Document upload).
- `feat: implement role-based access control` (Core security feature).
- `feat: add QR/Barcode integration` (Scanning module).
- `feat: develop real-time dashboard` (UI enhancements).
- `fix: resolve MySQL connection issues` (Bug fix).
- `chore: update dependencies and documentation` (Maintenance).

To view actual commit history:
```
git log --oneline --graph
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## References

- SRS Document: [Lab Tracking SRS V5.pdf](docs/Lab_Tracking_SRS_V5.pdf)
- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
- Badya University Software Engineering Project Guidelines (2025).

For questions or contributions, open an issue or submit a pull request!
