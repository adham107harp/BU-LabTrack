-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: smartunilabdb
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipment` (
  `EquipmentName` varchar(100) NOT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `LabID` int(11) DEFAULT NULL,
  PRIMARY KEY (`EquipmentName`),
  KEY `LabID` (`LabID`),
  CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`LabID`) REFERENCES `lab` (`LabID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES ('2 MHz Function Generator','',15),('Characteristic Curve of Diode & LED','',1),('Characteristic Curve of Transistor','',1),('Charging & Discharging of Capacitor','',1),('Digital Storage Oscilloscope 100 MHz','',15),('Hook\'s Law','',1),('Kirchhoff\'s Law Experiment','',1),('Law of Lenses and Optical Instruments','',1),('Measurement of Basic Constants','',1),('Ohm\'s Law Experiment','',1),('Simple Pendulum','',1),('Viscosity','',1);
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instructor` (
  `InstructorID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `InstructorEmail` varchar(100) NOT NULL,
  PRIMARY KEY (`InstructorID`),
  UNIQUE KEY `Email` (`InstructorEmail`),
  UNIQUE KEY `InstructorEmail` (`InstructorEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (84026,'Abeer Sarhan','Abeer.Mahmoud@badyauni.edu.eg'),(8004011,'Nouran Mohamed','Nouran.Mohamed@badyauni.edu.eg'),(8004012,'Rana Hamed','Rana.Hamed@badyauni.edu.eg'),(8004014,'Ziad Nabil','Ziad.Nabil@badyauni.edu.eg'),(8004023,'Seham Ahmed','Seham.Ahmed@badyauni.edu.eg'),(8004025,'Mohamed Abdo','Mohamed.Abdo@badyauni.edu.eg'),(8004027,'Abdelrhman Sherif','Abdelrahman.Sherif@badyauni.edu.eg'),(8004035,'Salwa Mabrouk','Salwa.Mabrouk@badyauni.edu.eg');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab`
--

DROP TABLE IF EXISTS `lab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lab` (
  `LabID` int(11) NOT NULL,
  `LabName` varchar(100) DEFAULT NULL,
  `Location` varchar(100) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL,
  `InstructorEmail` varchar(100) DEFAULT NULL,
  `RequiredLevel` int(11) DEFAULT 1,
  PRIMARY KEY (`LabID`),
  KEY `fk_lab_instructor` (`InstructorEmail`),
  CONSTRAINT `fk_lab_instructor` FOREIGN KEY (`InstructorEmail`) REFERENCES `instructor` (`InstructorEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab`
--

LOCK TABLES `lab` WRITE;
/*!40000 ALTER TABLE `lab` DISABLE KEYS */;
INSERT INTO `lab` VALUES (1,'Physics','Ground',30,NULL,2500),
(15,'Digital Logic Design Lab','Ground',30,NULL,2500),
(134,'Computer Lab','First',30,NULL,2500),
(135,'Computer Lab','First',30,NULL,2500),
(243,'Robotics Lab','Second',30,NULL,2400),
(244,'Physics Lab','Second',30,NULL,2500),
(245,'Virtually Reality','Second',30,NULL,2400),
(246,'Digital Logic Design Lab','Second',30,NULL,2500),
(247,'Computer Lab','Second',30,NULL,2500),
(250,'Computer Lab','Second',30,NULL,2500),
(251,'CyberSecurity Lab','Second',30,NULL,2400),
(255,'Research Lab','second',10,NULL,2500),
(256,'Research lab','Second',10,NULL,2500);
UNLOCK TABLES;
/*!40000 ALTER TABLE `lab` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labschedule`
--

DROP TABLE IF EXISTS `labschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `labschedule` (
  `LabID` int(11) NOT NULL,
  `Day` varchar(20) NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  KEY `LabID` (`LabID`),
  CONSTRAINT `labschedule_ibfk_1` FOREIGN KEY (`LabID`) REFERENCES `lab` (`LabID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labschedule`
--

LOCK TABLES `labschedule` WRITE;
/*!40000 ALTER TABLE `labschedule` DISABLE KEYS */;
INSERT INTO `labschedule` VALUES (1,'Monday','10:30:00','12:30:00'),(134,'Tuesday','10:30:00','12:30:00'),(134,'Monday','08:30:00','10:30:00'),(134,'Tuesday','08:30:00','10:30:00'),(134,'Tuesday','13:30:00','15:30:00'),(134,'Thursday','13:30:00','15:30:00');
/*!40000 ALTER TABLE `labschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenancerequest`
--

DROP TABLE IF EXISTS `maintenancerequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenancerequest` (
  `MaintenanceID` int(11) NOT NULL,
  `TechnicianID` int(11) DEFAULT NULL,
  `RequestDate` date DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `EquipmentName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MaintenanceID`),
  KEY `TechnicianID` (`TechnicianID`),
  KEY `maintenancerequest_ibfk_1` (`EquipmentName`),
  CONSTRAINT `maintenancerequest_ibfk_1` FOREIGN KEY (`EquipmentName`) REFERENCES `equipment` (`EquipmentName`),
  CONSTRAINT `maintenancerequest_ibfk_2` FOREIGN KEY (`TechnicianID`) REFERENCES `technician` (`TechnicianID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenancerequest`
--

LOCK TABLES `maintenancerequest` WRITE;
/*!40000 ALTER TABLE `maintenancerequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenancerequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research`
--

DROP TABLE IF EXISTS `research`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `research` (
  `ResearchEmail` varchar(100) NOT NULL,
  `LabID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ResearchEmail`),
  KEY `LabID` (`LabID`),
  CONSTRAINT `research_ibfk_1` FOREIGN KEY (`LabID`) REFERENCES `lab` (`LabID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping initial data for table research
LOCK TABLES `research` WRITE;
INSERT INTO `research` (`ResearchEmail`, `LabID`) VALUES
('Gaber.Osman@badyauni.edu.eg', 255),
('Marwa.Osama@badyauni.edu.eg', 255),
('Amira.Mohamed@badyauni.edu.eg', 256),
('Ahmed.Mohamed@badyauni.edu.eg', 256);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research`
--

LOCK TABLES `research` WRITE;
/*!40000 ALTER TABLE `research` DISABLE KEYS */;
/*!40000 ALTER TABLE `research` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation` (
  `ReservationID` int(11) NOT NULL,
  `LabID` int(11) DEFAULT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `SupervisorID` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Time` time DEFAULT NULL,
  `Duration` int(11) DEFAULT NULL,
  `Purpose` varchar(200) DEFAULT NULL,
  `ReservationType` varchar(20) DEFAULT NULL,
  `TeamSize` int(11) DEFAULT NULL,
  PRIMARY KEY (`ReservationID`),
  KEY `LabID` (`LabID`),
  KEY `StudentID` (`StudentID`),
  KEY `SupervisorID` (`SupervisorID`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`LabID`) REFERENCES `lab` (`LabID`),
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`SupervisorID`) REFERENCES `instructor` (`InstructorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `StudentID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`StudentID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (0,'',''),(2400378,'Nadine Ahmed Mahmoud Hamza','n.ahmed2400378@badyauni.edu.eg'),(2400487,'Mohaned Mouneer Ibrahim Abdelaal','m.mouneer2400487@badyauni.edu.eg'),(2400517,'Adham Mohammed Ateia Elsaeed','a.mohammed2400517@badyauni.edu.eg'),(2400519,'Mohamed Arafat Eid Elmohamdy','m.arafat2400519@badyauni.edu.eg'),(2400556,'Moaz Ahmed Abdallah Faragallah','m.ahmed2400556@badyauni.edu.eg'),(2400571,'Yehia Ahmed Sayed Ibrahem','y.ahmed2400571@badyauni.edu.eg'),(2400622,'Ziad Hamed Amer Hamed Shehata','z.hamed2400622@badyauni.edu.eg'),(2400624,'Mohamed Osama Mansour Khalaf','m.osama2400624@badyauni.edu.eg'),(2400630,'Ahmed Abdelaty Ahmed ','a.abdelaty2400630@badyauni.edu.eg'),(2400733,'Malak Mohamed Eliwa Ahmed','m.mohamed2400733@badyauni.edu.eg'),(2400734,'Omar Abdelaziz Abdelfattah ','o.abdelaziz2400734@badyauni.edu.eg'),(2400735,'Toka Waleed Ahmed Mahmoud','t.waleed2400735@badyauni.edu.eg'),(2400736,'Abdelrahman Ahmed Mohamed Tawfik','a.ahmed2400736@badyauni.edu.eg'),(2400738,'Nehal Ashraf Sofy Saber','n.ashraf2400738@badyauni.edu.eg'),(2400739,'Abdelrhman Mohamed Mahmod Mahmod','a.mohamed2400739@badyauni.edu.eg'),(2400740,'Fathy Ahmed Mohamed Fathy','f.ahmed2400740@badyauni.edu.eg'),(2400741,'Lamiaa Mahmoud Mohammed Housain','l.mahmoud2400741@badyauni.edu.eg'),(2400742,'Nour Elkassy Amin Husien','n.elkassy2400742@badyauni.edu.eg'),(2400757,'Khaled Mohamed Abdelnaby Elhosiny','k.mohamed2400757@badyauni.edu.eg'),(2400770,'Tasneem Saleh Abd el majeed Khames','t.saleh2400770@badyauni.edu.eg'),(2400772,'Nada Moetaz Ali Mustafa','n.moetaz2400772@badyauni.edu.eg'),(2400775,'Youssef Essam Mohamed Ibrahim','y.essam2400775@badyauni.edu.eg'),(2400778,'Rewan Ibrahim Abdrabo Ibrahim','r.ibrahim2400778@badyauni.edu.eg'),(2400781,'Hoda Ahmed Attia Awadallah','h.ahmed2400781@badyauni.edu.eg'),(2400785,'Mazen Hesham Ahmed mohamed Elnahal','m.hesham2400785@badyauni.edu.eg'),(2400789,'Rawda Abokhalil Bedir Ebrahim','r.abokhalil2400789@badyauni.edu.eg'),(2400802,'Mohamed Gamal  Abdel wahab Mahomud','m.gamal2400802@badyauni.edu.eg'),(2400825,'Nasr Youssef Nasr Kamel','n.youssef2400825@badyauni.edu.eg'),(2400826,'Sayed Mohamed Sayed Esaa','s.mohamed2400826@badyauni.edu.eg'),(2400829,'Ahmed Sherief Farouck Khalil','a.sherief2400829@badyauni.edu.eg'),(2401107,'Ahmed Ayman Mohamed Abdelghani ','a.ayman2401107@badyauni.edu.eg'),(2500140,'Hamza Emad Abdelrhaman Tammam','h.emad2500140@badyauni.edu.eg'),(2500392,'Omar Basel mohamed Afify','omar2500392@badyauni.edu.eg'),(2500457,'mazen ahmed mohamed ali','m.ahmed2500457@badyauni.edu.eg'),(2500558,'mohamed tamer sayed nagiub','m.tamer2500558@badyauni.edu.eg'),(2500611,'ahmed ehab ahmed nasr','a.ehab2500611@badyauni.edu.eg'),(2500796,'Yahia Mahmoud Mohamed Ahmed','y.mahmoud2500796@badyauni.edu.eg'),(2500827,'Abdelwahab Ramadan Hassan Masoud','a.ramadan2500827@badyauni.edu.eg'),(2500905,'Amr Mohamed Helmi Mohamed','a.mohamed2500905@badyauni.edu.eg'),(2500912,'Mohamed Wael Salah Ginidy','m.wael2500912@badyauni.edu.eg'),(2500926,'Yassin Amir Elsayed Abdrabu','y.amir2500926@badyauni.edu.eg'),(2500984,'Nour Mahmod Abdelhady Abdelkawy','n.mahmod2500984@badyauni.edu.eg'),(2501036,'Moaz Marouf Elshahhat Elshami','m.marouf2501036@badyauni.edu.eg'),(2501048,'Jana Mahmoud Saied Mahmoud','j.mahmoud2501048@badyauni.edu.eg'),(2501066,'Omar Ali Ibrahim Eldamarany','o.ali2501066@badyauni.edu.eg'),(2501089,'Youssef Emad Amen Metwaly','y.emad2501089@badyauni.edu.eg'),(2501282,'Omar Hany Omar Omar','o.hany2501282@badyauni.edu.eg'),(2501376,'Rawan Abdullah Fasseh Emam','r.abdullah2501376@badyauni.edu.eg'),(2501412,'Mazen Hossam Ibrahim Hammad','m.hossam2501412@badyauni.edu.eg'),(2501416,'Mohamed Hesham Mohamed Ahmed','m.hesham2501416@badyauni.edu.eg'),(2501424,'Zeyad Mohamed Hosssam Abd elatif','z.mohamed2501424@badyauni.edu.eg'),(2501449,'Yousef Abdelhalim Mahmoud Abdelhalim','y.abdelhalim2501449@badyauni.edu.eg'),(2501468,'Juliana Ashraf Rohy Kromar','j.ashraf2501468@badyauni.edu.eg'),(2501470,'Salma Mohamed Abdelmeneim Abdelhafez','s.mohamed2501470@badyauni.edu.eg'),(2501476,'Mohammed Ahmad Mohammed Lotfy','m.ahmad2501476@badyauni.edu.eg'),(2501484,'Berry Hatem Mohamed Saad','b.hatem2501484@badyauni.edu.eg'),(2501502,'Janan Osama Mansour Khalaf','j.osama2501502@badyauni.edu.eg'),(2501529,'Habiba Mohammed Fouad Abd el raouf','h.mohammed2501529@badyauni.edu.eg'),(2501542,'Ahmed Tarek Ibrahim Abd elgalil','a.tarek2501542@badyauni.edu.eg'),(2501621,'Mohamed Abdullah Ahmed shawky Mohamed','m.abdullah2501621@badyauni.edu.eg'),(2501633,'Mariam Hossam Raghep Ahmad','mariam2501633@badyauni.edu.eg'),(2501643,'Hana Ayman Mohamed Eldefrawy','h.ayman2501643@badyauni.edu.eg'),(2501648,'Mark Michael Girgis Zaki','m.michael2501648@badyauni.edu.eg'),(2501657,'Marwan Amr Elsayed Hassan','m.amr2501657@badyauni.edu.eg'),(2501667,'Fatmaal-zahraa Yasser Ebrahiem Mahmoud','f.yasser2501667@badyauni.edu.eg'),(2501674,'Mohamed Ahmed Hassan Elsayed','m.ahmed2501674@badyauni.edu.eg'),(2501678,'Mohamed Ahmed Ahmed Lotfy','m.ahmed2501678@badyauni.edu.eg'),(2501686,'Yousef Gamal Abdo Owais','y.gamal2501686@badyauni.edu.eg'),(2501691,'Ahmed Magdy Helmy Magdy','a.magdy2501691@badyauni.edu.eg'),(2501697,'Khaled Haridi Ibrahim Abdel razek','k.haridi2501697@badyauni.edu.eg'),(2501699,'Eyad Khaled Ahmed Ahmed','e.khaled2501699@badyauni.edu.eg'),(2501714,'Mohamed Hassan Mohamed Ali','m.hassan2501714@badyauni.edu.eg'),(2501723,'Ahmed Shady Ahmed Matter','a.shady2501723@badyauni.edu.eg'),(2501725,'Dania Abdulraouf Hesham Elhallaq','d.abdulraouf2501725@badyauni.edu.eg'),(2501740,'Mohamed Ahmed Sabry Sayed','m.ahmed2501740@badyauni.edu.eg'),(2501741,'Youmna Yousry Zakria Mahmed','y.yousry2501741@badyauni.edu.eg'),(2501746,'Youssef Ahmed Mohammed Ahmed','y.ahmed2501746@badyauni.edu.eg'),(2501767,'Youssef Reda Abdelaziz Abdelrahman','y.reda2501767@badyauni.edu.eg'),(2501788,'Abd allah Amir Mahmoud Ali','a.amir2501788@badyauni.edu.eg'),(2501794,'Marwan Mohamed Ismael Mabrok','m.mohamed2501794@badyauni.edu.eg'),(2501809,'Zayd Ahmed Tarek Moamed','z.ahmed2501809@badyauni.edu.eg'),(2501810,'Yasmine Saad Abdallah Hemaida','y.saad2501810@badyauni.edu.eg'),(2501838,'Rahma Yasser Mohamed ahmed Elsinety','r.yasser2501838@badyauni.edu.eg'),(2501876,'Arwa Ahmed Anwar Khedr','a.ahmed2501876@badyauni.edu.eg'),(2501880,'Amr Hatem Mohamed Abdelhameed','a.hatem2501880@badyauni.edu.eg'),(2501886,'Ahmed Mohamed Abdelhamid Ali','ahmed2501886@badyauni.edu.eg'),(2501899,'Ibrahim Mostafa Ibrahim Mohamed','ibrahim2501899@badyauni.edu.eg'),(2501902,'Ahmed Tamer Hassan Arafa','ahmed2501902@badyauni.edu.eg'),(2501905,'Omar Mohamed Ahmed Mohmoud','omar2501905@badyauni.edu.eg'),(2501939,'Abdelmonem Amr Abdelmonem Mohamed','abdelmonem2501939@badyauni.edu.eg');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teammember`
--

DROP TABLE IF EXISTS `teammember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teammember` (
  `TeamMemberID` int(11) NOT NULL,
  `ReservationID` int(11) DEFAULT NULL,
  `StudentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`TeamMemberID`),
  KEY `ReservationID` (`ReservationID`),
  KEY `StudentID` (`StudentID`),
  CONSTRAINT `teammember_ibfk_1` FOREIGN KEY (`ReservationID`) REFERENCES `reservation` (`ReservationID`),
  CONSTRAINT `teammember_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teammember`
--

LOCK TABLES `teammember` WRITE;
/*!40000 ALTER TABLE `teammember` DISABLE KEYS */;
/*!40000 ALTER TABLE `teammember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technician`
--

DROP TABLE IF EXISTS `technician`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `technician` (
  `TechnicianID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Specialization` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`TechnicianID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technician`
--

LOCK TABLES `technician` WRITE;
/*!40000 ALTER TABLE `technician` DISABLE KEYS */;
INSERT INTO `technician` VALUES (9001,'Ahmed Hassan','Physics Lab'),(9002,'Mona Ali','Physics Lab'),(9003,'Khaled Samir','Digital Logic Lab'),(9004,'Sara Mohamed','Computer Lab'),(9005,'Omar Tarek','Robotics Lab'),(9006,'Laila Nabil','CyberSecurity Lab'),(9007,'Mohamed Salah','Virtually Reality Lab'),(9008,'Aya Mahmoud','Research Lab');
/*!40000 ALTER TABLE `technician` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-12  1:46:00
