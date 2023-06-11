-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stocksalesdb
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `quantity` int DEFAULT '1',
  `CartId` int NOT NULL,
  `ItemId` int NOT NULL,
  PRIMARY KEY (`CartId`,`ItemId`),
  KEY `ItemId` (`ItemId`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`CartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`ItemId`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES (2,1,129),(4,2,130),(5,3,131);
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2023-06-01 11:41:32','2023-06-01 11:41:32',1),(2,'2023-06-01 12:04:28','2023-06-01 12:04:28',1),(3,'2023-06-01 12:07:19','2023-06-01 12:07:19',1);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Furniture'),(2,'Books'),(3,'Electronics'),(4,'Beauty'),(5,'Kitchen'),(6,'Toys'),(7,'Sporting Goods'),(8,'Home');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `sku` varchar(255) NOT NULL,
  `stock_quantity` int NOT NULL,
  `img_url` varchar(255) NOT NULL,
  `CategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `CategoryId` (`CategoryId`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (129,'Sofa',800,'FR123',2,'http://example.com/image/Sofa.jpg',1),(130,'Fiction Novel',15,'BK124',40,'http://example.com/image/Fiction Novel.jpg',2),(131,'Cookbook',25,'BK138',20,'http://example.com/image/Cookbook.jpg',2),(132,'Smartphone',500,'EL123',10,'http://example.com/image/Smartphone.jpg',3),(133,'Wireless Speaker',80,'EL140',12,'http://example.com/image/Wireless Speaker.jpg',3),(134,'Moisturizer',25,'BT123',20,'http://example.com/image/Moisturizer.jpg',4),(135,'Smartwatch',300,'EL125',8,'http://example.com/image/Smartwatch.jpg',3),(136,'Microwave',120,'KT126',18,'http://example.com/image/Microwave.jpg',5),(137,'Bed',1000,'FR125',5,'http://example.com/image/Bed.jpg',1),(138,'Facial Cleanser',20,'BT136',30,'http://example.com/image/Facial Cleanser.jpg',4),(139,'Remote Control Car',45,'TY135',10,'http://example.com/image/Remote Control Car.jpg',6),(140,'Toaster',50,'KT124',15,'http://example.com/image/Toaster.jpg',5),(141,'Dining Table',1200,'FR124',3,'http://example.com/image/Dining Table.jpg',1),(142,'Laptop',1000,'EL126',6,'http://example.com/image/Laptop.jpg',3),(143,'Board Game',30,'TY141',18,'http://example.com/image/Board Game.jpg',6),(144,'Running Shoes',80,'SG125',15,'http://example.com/image/Running Shoes.jpg',7),(145,'Basketball',30,'SG137',15,'http://example.com/image/Basketball.jpg',7),(146,'Tablet',700,'EL124',5,'http://example.com/image/Tablet.jpg',3),(147,'Picture Frame',20,'HM130',18,'http://example.com/image/Picture Frame.jpg',8),(148,'Coffee Maker',100,'KT123',20,'http://example.com/image/Coffee Maker.jpg',5),(149,'Decorative Vase',40,'HM126',10,'http://example.com/image/Decorative Vase.jpg',8),(150,'Blender',80,'KT125',25,'http://example.com/image/Blender.jpg',5),(151,'Lego Set',50,'TY127',25,'http://example.com/image/Lego Set.jpg',6),(152,'Desk',400,'FR126',4,'http://example.com/image/Desk.jpg',1),(153,'Lipstick',15,'BT129',30,'http://example.com/image/Lipstick.jpg',4),(154,'Yoga Mat',35,'SG131',8,'http://example.com/image/Yoga Mat.jpg',7),(155,'Wireless Headphones',100,'EL128',12,'http://example.com/image/Wireless Headphones.jpg',3),(156,'Smart Watch',150,'EL133',20,'http://example.com/image/Smart Watch.jpg',3),(157,'Non-Fiction Book',20,'BK132',45,'http://example.com/image/Non-Fiction Book.jpg',2),(158,'Candle',10,'HM139',50,'http://example.com/image/Candle.jpg',8),(159,'Throw Blanket',30,'HM134',25,'http://example.com/image/Throw Blanket.jpg',8),(160,'Mascara',15,'BT142',35,'http://example.com/image/Mascara.jpg',4);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `quantity` int DEFAULT '1',
  `price` float NOT NULL,
  `ItemId` int NOT NULL,
  `OrderId` int NOT NULL,
  PRIMARY KEY (`ItemId`,`OrderId`),
  KEY `OrderId` (`OrderId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`ItemId`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `totalPrice` float NOT NULL,
  `Ordered_at` datetime DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT 'Guest',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(2,'Guest');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `encryptedPassword` blob NOT NULL,
  `roleId` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bruker2','administratio2@gmail.com',_binary '$2b$10$a9TEsh8bmYxbmQc8.SPELOFJboerCA3CSRmPIrdHk9aZl7B5zrZD6',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-01 18:13:02
