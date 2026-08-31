<?php
ini_set('display_errors', 0);
error_reporting(0);
mysqli_report(MYSQLI_REPORT_OFF);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = @new mysqli("localhost", "thanjaiproperty_thanjaiproperty", "q-i_$^HnE{OnhY%E", "thanjaiproperty_crm");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database Connection failed: " . $conn->connect_error]);
    exit();
}
@$conn->set_charset("utf8mb4");

// Auto-migration helper for schema mismatches
function addCol($conn, $t, $c, $d) {
    try {
        $r = @$conn->query("SHOW COLUMNS FROM `$t` LIKE '$c'");
        if ($r && $r->num_rows == 0) {
            @$conn->query("ALTER TABLE `$t` ADD COLUMN `$c` $d");
        }
    } catch (\Throwable $e) {}
}

function renCol($conn, $t, $o, $n, $d) {
    try {
        $r = @$conn->query("SHOW COLUMNS FROM `$t` LIKE '$o'");
        if ($r && $r->num_rows > 0) {
            @$conn->query("ALTER TABLE `$t` CHANGE `$o` `$n` $d");
        }
    } catch (\Throwable $e) {}
}

// Auto-create core tables if not existing
@$conn->query("CREATE TABLE IF NOT EXISTS `portal_users` (
  `id` varchar(255) PRIMARY KEY,
  `fullName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `temporaryPassword` varchar(255) DEFAULT NULL,
  `isTemporaryPassword` tinyint(1) DEFAULT 0,
  `passwordUpdatedAt` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT 'Individual Owner',
  `roleCode` varchar(100) DEFAULT 'individualowner',
  `status` varchar(50) DEFAULT 'Active',
  `propertiesCount` int(11) DEFAULT 0,
  `visitorsCount` int(11) DEFAULT 0,
  `buyersCount` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");



@$conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_logs` (
  `id` varchar(255) PRIMARY KEY,
  `leadId` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `sender` varchar(255) DEFAULT 'Super Admin',
  `recipientName` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'outbound',
  `direction` varchar(50) DEFAULT 'outbound',
  `status` varchar(50) DEFAULT 'Delivered',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");

@$conn->query("ALTER TABLE `whatsapp_logs` ADD COLUMN IF NOT EXISTS `phone_number` varchar(50) DEFAULT NULL");
@$conn->query("ALTER TABLE `whatsapp_logs` ADD COLUMN IF NOT EXISTS `direction` varchar(50) DEFAULT 'outbound'");

@$conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_incoming` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `from_phone` varchar(50) DEFAULT NULL,
  `from_name` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `media_url` text DEFAULT NULL,
  `message_type` varchar(50) DEFAULT 'text',
  `timestamp` varchar(50) DEFAULT NULL,
  `raw_payload` longtext DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");

// NOTE: whatsapp_logs stores only OUTBOUND messages (sent from CRM/SmartPing).
// whatsapp_incoming stores only INBOUND messages (received from customers via webhook).
// The frontend fetches BOTH separately and merges them in WhatsAppLogView.js.
// CLEANUP SQL (run once in phpMyAdmin to remove duplicates from previous sync):
// DELETE FROM whatsapp_logs WHERE direction = 'inbound';


@$conn->query("CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` varchar(255) PRIMARY KEY,
  `timestamp` varchar(100) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `module` varchar(100) DEFAULT 'General',
  `details` text DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");
@$conn->query("ALTER TABLE `audit_logs` MODIFY `id` varchar(255)");

@$conn->query("CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` varchar(255) PRIMARY KEY,
  `title` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'General',
  `date` varchar(50) DEFAULT NULL,
  `readTime` varchar(50) DEFAULT '5 min read',
  `author` varchar(100) DEFAULT 'Admin',
  `authorAvatar` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `metaTitle` varchar(255) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `authorRole` varchar(255) DEFAULT NULL,
  `authorBio` text DEFAULT NULL,
  `authorSocial` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
)");

@$conn->query("CREATE TABLE IF NOT EXISTS `partners` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `contactPerson` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT 'Thanjavur',
  `country` varchar(255) DEFAULT 'India',
  `status` varchar(50) DEFAULT 'Active',
  `notes` longtext DEFAULT NULL,
  `leads` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");

@$conn->query("CREATE TABLE IF NOT EXISTS `ai_logs` (
  `id` varchar(255) PRIMARY KEY,
  `user_id` varchar(255) DEFAULT NULL,
  `prompt` longtext DEFAULT NULL,
  `response` longtext DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");
@$conn->query("ALTER TABLE `ai_logs` MODIFY `id` varchar(255)");

@$conn->query("CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` varchar(255) PRIMARY KEY,
  `setting_value` longtext DEFAULT NULL,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Safely patch columns
addCol($conn, 'leads', 'source', 'varchar(255) DEFAULT NULL');
addCol($conn, 'leads', 'requirement', 'varchar(255) DEFAULT NULL');
addCol($conn, 'leads', 'timeline', 'longtext DEFAULT NULL');
addCol($conn, 'leads', 'followup', 'varchar(255) DEFAULT NULL');
addCol($conn, 'leads', 'assignedTo', 'varchar(255) DEFAULT NULL');
addCol($conn, 'leads', 'notes', 'longtext DEFAULT NULL');
addCol($conn, 'leads', 'location', 'varchar(255) DEFAULT NULL');
addCol($conn, 'leads', 'budget', 'varchar(255) DEFAULT NULL');
addCol($conn, 'leads', 'purpose', 'varchar(255) DEFAULT NULL');

@$conn->query("ALTER TABLE leads MODIFY COLUMN timeline LONGTEXT");
@$conn->query("ALTER TABLE leads MODIFY COLUMN notes LONGTEXT");
addCol($conn, 'leads', 'whatsapp', 'varchar(50) DEFAULT NULL');

addCol($conn, 'blog_posts', 'slug', 'varchar(255) DEFAULT NULL');
addCol($conn, 'blog_posts', 'metaTitle', 'varchar(255) DEFAULT NULL');
addCol($conn, 'blog_posts', 'metaDescription', 'text DEFAULT NULL');
addCol($conn, 'blog_posts', 'authorRole', 'varchar(255) DEFAULT NULL');
addCol($conn, 'blog_posts', 'authorBio', 'text DEFAULT NULL');
addCol($conn, 'blog_posts', 'authorSocial', 'varchar(255) DEFAULT NULL');

addCol($conn, 'admin_staff', 'fullName', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'email', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'phone', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'password', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'role', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'roleCode', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'status', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'lastLogin', 'varchar(255) DEFAULT NULL');
addCol($conn, 'admin_staff', 'allowedModules', 'longtext DEFAULT NULL');

addCol($conn, 'properties', 'adType', "varchar(50) DEFAULT 'free'");
addCol($conn, 'properties', 'userId', 'varchar(255) DEFAULT NULL');
addCol($conn, 'properties', 'userEmail', 'varchar(255) DEFAULT NULL');
addCol($conn, 'properties', 'actualOwnerName', 'varchar(255) DEFAULT NULL');
addCol($conn, 'properties', 'actualOwnerPhone', 'varchar(255) DEFAULT NULL');

addCol($conn, 'partners', 'company', 'varchar(255) DEFAULT NULL');
addCol($conn, 'partners', 'type', 'varchar(255) DEFAULT NULL');
addCol($conn, 'partners', 'leads', 'int DEFAULT 0');
addCol($conn, 'partners', 'contactPerson', 'varchar(255) DEFAULT NULL');
addCol($conn, 'partners', 'whatsapp', 'varchar(50) DEFAULT NULL');
addCol($conn, 'partners', 'city', 'varchar(255) DEFAULT NULL');
addCol($conn, 'partners', 'country', 'varchar(255) DEFAULT "India"');
addCol($conn, 'partners', 'notes', 'longtext DEFAULT NULL');

addCol($conn, 'portal_users', 'password', 'varchar(255) DEFAULT NULL');
addCol($conn, 'portal_users', 'temporaryPassword', 'varchar(255) DEFAULT NULL');
addCol($conn, 'portal_users', 'isTemporaryPassword', 'tinyint(1) DEFAULT 0');
addCol($conn, 'portal_users', 'passwordUpdatedAt', 'varchar(100) DEFAULT NULL');
addCol($conn, 'portal_users', 'role', 'varchar(100) DEFAULT "Individual Owner"');
addCol($conn, 'portal_users', 'roleCode', 'varchar(100) DEFAULT "individualowner"');
addCol($conn, 'portal_users', 'status', 'varchar(50) DEFAULT "Active"');
renCol($conn, 'portal_users', 'name', 'fullName', 'varchar(255) DEFAULT NULL');
addCol($conn, 'portal_users', 'propertiesCount', 'int(11) DEFAULT 0');
addCol($conn, 'portal_users', 'visitorsCount', 'int(11) DEFAULT 0');
addCol($conn, 'portal_users', 'buyersCount', 'int(11) DEFAULT 0');


addCol($conn, 'website_images', 'asset_key', 'varchar(255) DEFAULT NULL');
addCol($conn, 'website_images', 'asset_url', 'longtext DEFAULT NULL');
addCol($conn, 'website_images', 'default_url', 'longtext DEFAULT NULL');
addCol($conn, 'website_images', 'title', 'varchar(255) DEFAULT NULL');
addCol($conn, 'website_images', 'category', 'varchar(100) DEFAULT NULL');

addCol($conn, 'whatsapp_logs', 'sender', 'varchar(255) DEFAULT "Super Admin"');
addCol($conn, 'whatsapp_logs', 'recipientName', 'varchar(255) DEFAULT NULL');
addCol($conn, 'whatsapp_logs', 'phone', 'varchar(50) DEFAULT NULL');
addCol($conn, 'whatsapp_logs', 'leadId', 'varchar(255) DEFAULT NULL');
addCol($conn, 'whatsapp_logs', 'message', 'longtext DEFAULT NULL');
addCol($conn, 'whatsapp_logs', 'type', 'varchar(50) DEFAULT "outbound"');
addCol($conn, 'whatsapp_logs', 'status', 'varchar(50) DEFAULT "Delivered"');

@$conn->query("DROP TABLE IF EXISTS `dashboard_stats`");
@$conn->query("DROP TABLE IF EXISTS `pipeline_stages`");
@$conn->query("DROP TABLE IF EXISTS `property_approvals`");
@$conn->query("DROP TABLE IF EXISTS `reports`");
@$conn->query("DROP TABLE IF EXISTS `shared_leads`");
$tables = ['leads', 'properties', 'site_visits', 'partners', 'ai_logs', 'whatsapp_logs', 'portal_users', 'audit_logs'];
foreach($tables as $t) {
    renCol($conn, $t, 'created_at', 'createdAt', 'datetime DEFAULT CURRENT_TIMESTAMP');
}


$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Parse URL flexibly
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = array_values(array_filter(explode('/', trim($path, '/'))));

$resource = '';
$id = null;

if (!empty($_GET['resource'])) {
    $resource = $_GET['resource'];
    $id = $_GET['id'] ?? null;
} else {
    $apiIndex = -1;
    foreach ($path_parts as $idx => $part) {
        if ($part === 'api.php' || $part === 'api') {
            $apiIndex = $idx;
            break;
        }
    }
    
    if ($apiIndex !== -1) {
        $resource = $path_parts[$apiIndex + 1] ?? '';
        $id = $path_parts[$apiIndex + 2] ?? null;
    } else if (count($path_parts) > 0) {
        $resource = $path_parts[0];
        $id = $path_parts[1] ?? null;
    }
}

if (empty($resource) && $method === 'POST') {
    $rawCheck = file_get_contents("php://input");
    $dataCheck = json_decode($rawCheck, true);
    if (isset($dataCheck['entry']) || isset($dataCheck['messages']) || isset($dataCheck['from']) || isset($dataCheck['sender']) || isset($dataCheck['waId']) || isset($dataCheck['destination'])) {
        $resource = 'webhook';
    }
}

if ($resource === 'properties') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM properties ORDER BY createdAt DESC");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO properties (id, title, type, category, categoryRaw, categoryLabel, purpose, price, priceFormatted, location, district, address, size, bedrooms, bathrooms, furnishing, status, availability, latitude, longitude, videoUrl, ownerName, ownerPhone, listedBy, adType, userId, userEmail, actualOwnerName, actualOwnerPhone, images, description, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $images = json_encode($data['images'] ?? []);
        $features = json_encode($data['features'] ?? []);
        $adType = $data['adType'] ?? 'free';
        $userId = $data['userId'] ?? null;
        $userEmail = $data['userEmail'] ?? null;
        $actualOwnerName = $data['actualOwnerName'] ?? null;
        $actualOwnerPhone = $data['actualOwnerPhone'] ?? null;
        $stmt->bind_param("sssssssdsssssiisssssssssssssssss", $data['id'], $data['title'], $data['type'], $data['category'], $data['categoryRaw'], $data['categoryLabel'], $data['purpose'], $data['price'], $data['priceFormatted'], $data['location'], $data['district'], $data['address'], $data['size'], $data['bedrooms'], $data['bathrooms'], $data['furnishing'], $data['status'], $data['availability'], $data['latitude'], $data['longitude'], $data['videoUrl'], $data['ownerName'], $data['ownerPhone'], $data['listedBy'], $adType, $userId, $userEmail, $actualOwnerName, $actualOwnerPhone, $images, $data['description'], $features);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Property created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE properties SET title=?, type=?, category=?, categoryRaw=?, categoryLabel=?, purpose=?, price=?, priceFormatted=?, location=?, district=?, address=?, size=?, bedrooms=?, bathrooms=?, furnishing=?, status=?, availability=?, latitude=?, longitude=?, videoUrl=?, ownerName=?, ownerPhone=?, listedBy=?, adType=?, userId=?, userEmail=?, actualOwnerName=?, actualOwnerPhone=?, images=?, description=?, features=? WHERE id=?");
        $images = json_encode($data['images'] ?? []);
        $features = json_encode($data['features'] ?? []);
        $adType = $data['adType'] ?? 'free';
        $userId = $data['userId'] ?? null;
        $userEmail = $data['userEmail'] ?? null;
        $actualOwnerName = $data['actualOwnerName'] ?? null;
        $actualOwnerPhone = $data['actualOwnerPhone'] ?? null;
        $stmt->bind_param("ssssssdsssssiissssssssssssssssss", $data['title'], $data['type'], $data['category'], $data['categoryRaw'], $data['categoryLabel'], $data['purpose'], $data['price'], $data['priceFormatted'], $data['location'], $data['district'], $data['address'], $data['size'], $data['bedrooms'], $data['bathrooms'], $data['furnishing'], $data['status'], $data['availability'], $data['latitude'], $data['longitude'], $data['videoUrl'], $data['ownerName'], $data['ownerPhone'], $data['listedBy'], $adType, $userId, $userEmail, $actualOwnerName, $actualOwnerPhone, $images, $data['description'], $features, $id);
        $stmt->execute();
        echo json_encode(["message" => "Property updated successfully"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM properties WHERE id=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode(["message" => "Property deleted successfully"]);
    }
} 
elseif ($resource === 'leads') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM leads ORDER BY createdAt DESC");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO leads (id, name, phone, whatsapp, email, source, status, budget, requirement, location, timeline, assignedTo, notes, followup) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Database prepare error: " . $conn->error]);
            exit();
        }
        $phone = $data['phone'] ?? $data['mobile'] ?? '';
        $whatsapp = $data['whatsapp'] ?? $phone;
        $timeline = is_string($data['timeline'] ?? null) ? $data['timeline'] : json_encode($data['timeline'] ?? []);
        $notes = is_string($data['notes'] ?? null) ? $data['notes'] : json_encode($data['notes'] ?? []);
        $followup = $data['followup'] ?? '—';
        $location = $data['location'] ?? $data['area'] ?? $data['city'] ?? 'Thanjavur';
        $requirement = $data['requirement'] ?? $data['propertyType'] ?? $data['type'] ?? 'Residential Plot';
        $assignedTo = $data['assignedTo'] ?? $data['assignTo'] ?? 'Unassigned';
        $stmt->bind_param("ssssssssssssss", $data['id'], $data['name'], $phone, $whatsapp, $data['email'], $data['source'], $data['status'], $data['budget'], $requirement, $location, $timeline, $assignedTo, $notes, $followup);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Lead created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE leads SET name=?, phone=?, whatsapp=?, email=?, source=?, status=?, budget=?, requirement=?, location=?, timeline=?, assignedTo=?, notes=?, followup=? WHERE id=?");
        $phone = $data['phone'] ?? $data['mobile'] ?? '';
        $whatsapp = $data['whatsapp'] ?? $phone;
        $timeline = is_string($data['timeline'] ?? null) ? $data['timeline'] : json_encode($data['timeline'] ?? []);
        $notes = is_string($data['notes'] ?? null) ? $data['notes'] : json_encode($data['notes'] ?? []);
        $followup = $data['followup'] ?? '—';
        $location = $data['location'] ?? $data['area'] ?? $data['city'] ?? 'Thanjavur';
        $requirement = $data['requirement'] ?? $data['propertyType'] ?? $data['type'] ?? 'Residential Plot';
        $assignedTo = $data['assignedTo'] ?? $data['assignTo'] ?? 'Unassigned';
        $stmt->bind_param("ssssssssssssss", $data['name'], $phone, $whatsapp, $data['email'], $data['source'], $data['status'], $data['budget'], $requirement, $location, $timeline, $assignedTo, $notes, $followup, $id);
        $stmt->execute();
        echo json_encode(["message" => "Lead updated successfully"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM leads WHERE id=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode(["message" => "Lead deleted successfully"]);
    }
}

elseif ($resource === 'blog' || $resource === 'blog_posts') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
        $rows = [];
        if ($result) {
            while($row = $result->fetch_assoc()) { $rows[] = $row; }
        }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON payload"]);
            exit;
        }

        $bId = strval($data['id'] ?? ('blog-' . time()));
        $bSlug = strval($data['slug'] ?? $bId);
        $bTitle = strval($data['title'] ?? 'Untitled Article');
        $bCat = strval($data['category'] ?? 'Legal & Patta');
        $bDate = strval($data['date'] ?? date('d M Y'));
        $bRead = strval($data['readTime'] ?? '5 min read');
        $bAuthor = strval($data['author'] ?? 'Admin');
        $bAvatar = strval($data['authorAvatar'] ?? '');
        $bImage = strval($data['image'] ?? '');
        $bExcerpt = strval($data['excerpt'] ?? '');
        $bContent = strval($data['content'] ?? '');
        $bMetaT = strval($data['metaTitle'] ?? $bTitle);
        $bMetaD = strval($data['metaDescription'] ?? $bExcerpt);
        $bRole = strval($data['authorRole'] ?? '');
        $bBio = strval($data['authorBio'] ?? '');
        $bSocial = strval($data['authorSocial'] ?? '');
        
        $stmt = $conn->prepare("INSERT INTO blog_posts (id, slug, title, category, date, readTime, author, authorAvatar, image, excerpt, content, metaTitle, metaDescription, authorRole, authorBio, authorSocial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), date=VALUES(date), readTime=VALUES(readTime), image=VALUES(image), excerpt=VALUES(excerpt), content=VALUES(content), slug=VALUES(slug), metaTitle=VALUES(metaTitle), metaDescription=VALUES(metaDescription)");
        $stmt->bind_param("ssssssssssssssss", $bId, $bSlug, $bTitle, $bCat, $bDate, $bRead, $bAuthor, $bAvatar, $bImage, $bExcerpt, $bContent, $bMetaT, $bMetaD, $bRole, $bBio, $bSocial);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Saved successfully", "id" => $bId]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $bSlug = strval($data['slug'] ?? $id);
        $bTitle = strval($data['title'] ?? 'Untitled Article');
        $bCat = strval($data['category'] ?? 'Legal & Patta');
        $bDate = strval($data['date'] ?? date('d M Y'));
        $bRead = strval($data['readTime'] ?? '5 min read');
        $bAuthor = strval($data['author'] ?? 'Admin');
        $bAvatar = strval($data['authorAvatar'] ?? '');
        $bImage = strval($data['image'] ?? '');
        $bExcerpt = strval($data['excerpt'] ?? '');
        $bContent = strval($data['content'] ?? '');
        $bMetaT = strval($data['metaTitle'] ?? $bTitle);
        $bMetaD = strval($data['metaDescription'] ?? $bExcerpt);
        $bRole = strval($data['authorRole'] ?? '');
        $bBio = strval($data['authorBio'] ?? '');
        $bSocial = strval($data['authorSocial'] ?? '');
        $targetId = strval($id);
        
        $stmt = $conn->prepare("UPDATE blog_posts SET slug=?, title=?, category=?, date=?, readTime=?, author=?, authorAvatar=?, image=?, excerpt=?, content=?, metaTitle=?, metaDescription=?, authorRole=?, authorBio=?, authorSocial=? WHERE id=?");
        $stmt->bind_param("ssssssssssssssss", $bSlug, $bTitle, $bCat, $bDate, $bRead, $bAuthor, $bAvatar, $bImage, $bExcerpt, $bContent, $bMetaT, $bMetaD, $bRole, $bBio, $bSocial, $targetId);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        if ($id === 'reset') {
            $conn->query("TRUNCATE TABLE blog_posts");
            echo json_encode(["message" => "Reset successfully"]);
        } else {
            $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id=?");
            $stmt->bind_param("s", $id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Deleted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database error: " . $stmt->error]);
            }
        }
    }
}

elseif ($resource === 'categories') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM categories");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO categories (id, name, unitSingular, unitPlural, defaultImage, description) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['name'], $data['unitSingular'], $data['unitPlural'], $data['defaultImage'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE categories SET name=?, unitSingular=?, unitPlural=?, defaultImage=?, description=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['name'], $data['unitSingular'], $data['unitPlural'], $data['defaultImage'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM categories WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'locations') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM locations");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $data['popularAreas'] = json_encode($data['popularAreas'] ?? []);
        
        $stmt = $conn->prepare("INSERT INTO locations (id, name, tagline, defaultImage, popularAreas, description) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['name'], $data['tagline'], $data['defaultImage'], $data['popularAreas'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $data['popularAreas'] = json_encode($data['popularAreas'] ?? []);
        
        $stmt = $conn->prepare("UPDATE locations SET name=?, tagline=?, defaultImage=?, popularAreas=?, description=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['name'], $data['tagline'], $data['defaultImage'], $data['popularAreas'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM locations WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'agents') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM agents");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO agents (id, name, role, company, experience, phone, whatsapp, email, activeListings, location, image, specialty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssisss", $data['id'], $data['name'], $data['role'], $data['company'], $data['experience'], $data['phone'], $data['whatsapp'], $data['email'], $data['activeListings'], $data['location'], $data['image'], $data['specialty']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE agents SET name=?, role=?, company=?, experience=?, phone=?, whatsapp=?, email=?, activeListings=?, location=?, image=?, specialty=? WHERE id=?");
        $stmt->bind_param("sssssssissss", $data['name'], $data['role'], $data['company'], $data['experience'], $data['phone'], $data['whatsapp'], $data['email'], $data['activeListings'], $data['location'], $data['image'], $data['specialty'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM agents WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'site_images') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM site_images");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO site_images (id, title, category, recommendedWidth, recommendedHeight, aspectRatio, format, maxSize, defaultUrl, currentUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiissssss", $data['id'], $data['title'], $data['category'], $data['recommendedWidth'], $data['recommendedHeight'], $data['aspectRatio'], $data['format'], $data['maxSize'], $data['defaultUrl'], $data['currentUrl'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE site_images SET title=?, category=?, recommendedWidth=?, recommendedHeight=?, aspectRatio=?, format=?, maxSize=?, defaultUrl=?, currentUrl=?, description=? WHERE id=?");
        $stmt->bind_param("ssiisssssss", $data['title'], $data['category'], $data['recommendedWidth'], $data['recommendedHeight'], $data['aspectRatio'], $data['format'], $data['maxSize'], $data['defaultUrl'], $data['currentUrl'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM site_images WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'admin_users') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM admin_staff");
        $rows = [];
        while($row = $result->fetch_assoc()) { 
            if (isset($row['allowedModules']) && is_string($row['allowedModules'])) {
                $decoded = json_decode($row['allowedModules'], true);
                $row['allowedModules'] = is_array($decoded) ? $decoded : [];
            }
            $rows[] = $row; 
        }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        try {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid JSON or empty body", "input" => $input]);
                exit;
            }
            
            $data['allowedModules'] = json_encode($data['allowedModules'] ?? []);
            $stmt = $conn->prepare("INSERT INTO `admin_staff` (`id`, `fullName`, `name`, `email`, `phone`, `password`, `role`, `roleCode`, `status`, `lastLogin`, `allowedModules`, `permissions_json`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Prepare failed: " . $conn->error]);
                exit;
            }
            $empty_permissions = '[]';
            $created_at = date('Y-m-d H:i:s');
            $stmt->bind_param("sssssssssssss", $data['id'], $data['fullName'], $data['fullName'], $data['email'], $data['phone'], $data['password'], $data['role'], $data['roleCode'], $data['status'], $data['lastLogin'], $data['allowedModules'], $empty_permissions, $created_at);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Created successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database error: " . $stmt->error]);
            }
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(["error" => "Fatal PHP Error: " . $e->getMessage(), "line" => $e->getLine()]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        try {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid JSON or empty body"]);
                exit;
            }
            
            $data['allowedModules'] = json_encode($data['allowedModules'] ?? []);
            $stmt = $conn->prepare("UPDATE `admin_staff` SET `fullName`=?, `name`=?, `email`=?, `phone`=?, `password`=?, `role`=?, `roleCode`=?, `status`=?, `lastLogin`=?, `allowedModules`=? WHERE `id`=?");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Prepare failed: " . $conn->error]);
                exit;
            }
            $stmt->bind_param("sssssssssss", $data['fullName'], $data['fullName'], $data['email'], $data['phone'], $data['password'], $data['role'], $data['roleCode'], $data['status'], $data['lastLogin'], $data['allowedModules'], $id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database error: " . $stmt->error]);
            }
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(["error" => "Fatal PHP Error: " . $e->getMessage()]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM admin_staff WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'partners') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM partners ORDER BY createdAt DESC");
        $rows = [];
        if ($result) {
            while($row = $result->fetch_assoc()) { $rows[] = $row; }
        }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Partner ID is required"]);
            exit;
        }
        
        $stmt = $conn->prepare("INSERT INTO partners (id, name, company, type, contactPerson, phone, whatsapp, email, city, country, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company), type=VALUES(type), contactPerson=VALUES(contactPerson), phone=VALUES(phone), whatsapp=VALUES(whatsapp), email=VALUES(email), city=VALUES(city), country=VALUES(country), status=VALUES(status), notes=VALUES(notes)");
        $name = $data['name'] ?? ($data['company'] ?? '');
        $company = $data['company'] ?? ($data['name'] ?? '');
        $type = $data['type'] ?? ($data['contact'] ?? '');
        $contactPerson = $data['contactPerson'] ?? ($data['contact'] ?? '');
        $phone = $data['phone'] ?? '';
        $whatsapp = $data['whatsapp'] ?? $phone;
        $email = $data['email'] ?? '';
        $city = $data['city'] ?? 'Thanjavur';
        $country = $data['country'] ?? 'India';
        $status = $data['status'] ?? 'Active';
        $notes = $data['notes'] ?? '';
        
        $stmt->bind_param("ssssssssssss", $data['id'], $name, $company, $type, $contactPerson, $phone, $whatsapp, $email, $city, $country, $status, $notes);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Saved successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $conn->prepare("UPDATE partners SET name=?, company=?, type=?, contactPerson=?, phone=?, whatsapp=?, email=?, city=?, country=?, status=?, notes=? WHERE id=?");
        $name = $data['name'] ?? ($data['company'] ?? '');
        $company = $data['company'] ?? ($data['name'] ?? '');
        $type = $data['type'] ?? ($data['contact'] ?? '');
        $contactPerson = $data['contactPerson'] ?? ($data['contact'] ?? '');
        $phone = $data['phone'] ?? '';
        $whatsapp = $data['whatsapp'] ?? $phone;
        $email = $data['email'] ?? '';
        $city = $data['city'] ?? 'Thanjavur';
        $country = $data['country'] ?? 'India';
        $status = $data['status'] ?? 'Active';
        $notes = $data['notes'] ?? '';

        $stmt->bind_param("ssssssssssss", $name, $company, $type, $contactPerson, $phone, $whatsapp, $email, $city, $country, $status, $notes, $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM partners WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}


elseif ($resource === 'send_whatsapp') {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $destination = $data['destination'] ?? ($data['phone'] ?? '');
        $campaignName = $data['campaignName'] ?? 'initial_contact_intro';
        $userName = $data['userName'] ?? 'Customer';
        $templateParams = $data['templateParams'] ?? [];
        $apiKey = $data['apiKey'] ?? '';
        $customMedia = $data['media'] ?? null;

        // Permanent master SmartPing/AiSensy API key — always available as fallback
        $MASTER_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjYxNjVmODFhMDg2MTIzZWY5MWQ5MCIsIm5hbWUiOiJUaGFuamFpIFByb3BlcnR5IiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY5NjYxNjVmODFhMDg2MTIzZWY5MWQ4OSIsImFjdGl2ZVBsYW4iOiJQUk9fTU9OVEhMWSIsImlhdCI6MTc4NzcyNDczOX0.8SQSQDJdxrAivj8FAkWvjSk_qx4yE0dENDh70US75G0';

        // 1. Try to get API key from database settings
        if (empty($apiKey)) {
            $setRes = $conn->query("SELECT setting_value FROM settings WHERE setting_key='whatsapp_integration'");
            if ($setRes && $setRow = $setRes->fetch_assoc()) {
                $waSet = json_decode($setRow['setting_value'], true);
                if (!empty($waSet['apiKey'])) {
                    $apiKey = $waSet['apiKey'];
                }
            }
        }
        // 2. Always fall back to master key if still empty
        if (empty($apiKey)) {
            $apiKey = $MASTER_API_KEY;
        }

        // Clean & format phone digits
        $digits = preg_replace('/\D/', '', $destination);
        $last10 = substr($digits, -10);
        $aiSensyPhone = '91' . $last10;
        $smartPingPhone = '+91' . $last10;

        // Ensure all template params are string values
        $stringParams = array_values(array_map(function($p) { return (string)$p; }, $templateParams));

        // Default media header to satisfy media template requirement
        $mediaPayload = $customMedia ?: [
            'url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'filename' => 'thanjai-property.jpg'
        ];

        $isSuccess = false;
        $response = '';
        $resJson = null;
        $curlErr = '';

        // 1. PRIMARY: SmartPing endpoint (this is what Thanjai Property uses)
        $smartPingUrl = 'https://backend.api-wa.co/campaign/smartping/api/v2';
        $payload1 = json_encode([
            'apiKey' => $apiKey,
            'campaignName' => $campaignName,
            'destination' => $smartPingPhone,
            'userName' => (string)$userName,
            'templateParams' => $stringParams,
            'media' => $mediaPayload
        ]);

        $ch = curl_init($smartPingUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr = curl_error($ch);
        curl_close($ch);

        $resJson = json_decode($response, true);
        $isSuccess = ($resJson['status'] ?? '') === 'success'
                  || ($resJson['submitted_message_id'] ?? false)
                  || ($httpCode >= 200 && $httpCode < 300 && empty($resJson['message']));

        // 2. FALLBACK: AiSensy endpoint if SmartPing did not succeed
        if (!$isSuccess) {
            $aiSensyUrl = 'https://backend.aisensy.com/campaign/t1/api/v2';
            $payload2 = json_encode([
                'apiKey' => $apiKey,
                'campaignName' => $campaignName,
                'destination' => $aiSensyPhone,
                'userName' => (string)$userName,
                'templateParams' => $stringParams,
                'media' => $mediaPayload
            ]);

            $ch2 = curl_init($aiSensyUrl);
            curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2, CURLOPT_POST, true);
            curl_setopt($ch2, CURLOPT_POSTFIELDS, $payload2);
            curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch2, CURLOPT_TIMEOUT, 12);
            $res2 = curl_exec($ch2);
            $httpCode2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
            curl_close($ch2);

            $resJson2 = json_decode($res2, true);
            if (($resJson2['success'] ?? '') === 'true' || ($resJson2['submitted_message_id'] ?? false) || ($httpCode2 >= 200 && $httpCode2 < 300)) {
                $response = $res2;
                $resJson = $resJson2;
                $isSuccess = true;
            }
        }

        // Render full readable text for the log
        $renderedMsg = $data['messageText'] ?? '';
        if (empty($renderedMsg)) {
            if ($campaignName === 'partner_lead_assignment') {
                $renderedMsg = "Partner Lead Assigned: " . implode(" | ", $stringParams);
            } elseif ($campaignName === 'partner_transfer_notification') {
                $renderedMsg = "Partner Transfer Notification sent to customer for property requirements.";
            } elseif ($campaignName === 'initial_contact_intro') {
                $p1 = $stringParams[0] ?? $userName;
                $renderedMsg = "Hello $p1, Thank you for your interest in Thanjai Property! We have received your requirement. Our property advisors will assist you shortly with verified documents, prime locations, and direct builder coordination. Official Desk: +91 84899 96852.";
            } elseif ($campaignName === 'property_follow_up') {
                $p1 = $stringParams[0] ?? $userName;
                $p3 = $stringParams[2] ?? 'We are following up on your property requirement.';
                $renderedMsg = "Hello $p1, We are following up regarding your property requirement in Thanjavur: $p3";
            } elseif ($campaignName === 'site_visit_confirmation' || $campaignName === 'stage_site_visit_scheduled') {
                $p1 = $stringParams[0] ?? $userName;
                $p2 = $stringParams[1] ?? 'Property';
                $renderedMsg = "Hello $p1, Your site visit for $p2 has been scheduled. Our field manager will assist you with plot boundaries, layout review, and Patta verification.";
            } else {
                $renderedMsg = count($stringParams) > 0 ? ("[$campaignName] " . implode(" | ", $stringParams)) : "[$campaignName]";
            }
        }

        // Write outbound message to unified whatsapp_messages table
        $conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_messages` (
            `id` bigint NOT NULL AUTO_INCREMENT,
            `direction` varchar(10) DEFAULT 'outbound',
            `customer_phone` varchar(20) DEFAULT NULL,
            `customer_name` varchar(255) DEFAULT NULL,
            `message` longtext,
            `media_url` text,
            `message_type` varchar(20) DEFAULT 'text',
            `source` varchar(30) DEFAULT 'crm_reply',
            `raw_payload` longtext,
            `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_phone` (`customer_phone`),
            KEY `idx_createdAt` (`createdAt`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $safe_wa_phone = $conn->real_escape_string($smartPingPhone);
        $safe_wa_name  = $conn->real_escape_string($userName);
        $safe_wa_msg   = $conn->real_escape_string($renderedMsg);
        $conn->query("INSERT INTO `whatsapp_messages` (`direction`, `customer_phone`, `customer_name`, `message`, `source`) VALUES ('outbound', '$safe_wa_phone', '$safe_wa_name', '$safe_wa_msg', 'crm_reply')");

        echo json_encode([
            'success' => $isSuccess,
            'campaignName' => $campaignName,
            'destination' => $smartPingPhone,
            'templateParams' => $stringParams,
            'response' => $resJson ?: $response,
            'curlError' => $curlErr
        ]);
        exit;
    }
}

elseif ($resource === 'settings') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM settings");
        $rows = [];
        if ($result) {
            while($row = $result->fetch_assoc()) { 
                $rows[$row['setting_key']] = $row['setting_value']; 
            }
        }
        echo json_encode($rows);
    }
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $key = $data['key'] ?? ($data['setting_key'] ?? '');
        $val = $data['value'] ?? ($data['setting_value'] ?? '');
        if ($key) {
            $stmt = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)");
            $stmt->bind_param("ss", $key, $val);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Settings saved successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => $stmt->error]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Key is required"]);
        }
    }
}

elseif ($resource === 'site_visits') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM site_visits");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        try {
            $stmt = $conn->prepare("INSERT INTO site_visits (id, leadId, propertyId, visitDate, status, assignedTo, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $data['id'], $data['leadId'], $data['propertyId'], $data['visitDate'], $data['status'], $data['assignedTo'], $data['notes']);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Created successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database error: " . $stmt->error]);
            }
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(["error" => "Fatal Exception: " . $e->getMessage()]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE site_visits SET leadId=?, propertyId=?, visitDate=?, status=?, assignedTo=?, notes=? WHERE id=?");
        $stmt->bind_param("sssssss", $data['leadId'], $data['propertyId'], $data['visitDate'], $data['status'], $data['assignedTo'], $data['notes'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM site_visits WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'ai_logs') {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Log ID is required"]);
            exit;
        }
        
        $stmt = $conn->prepare("INSERT INTO ai_logs (id, user_id, prompt, response) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Prepare failed: " . $conn->error]);
            exit;
        }
        $stmt->bind_param("ssss", $data['id'], $data['user_id'], $data['prompt'], $data['response']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Saved successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Execute failed: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'audit_logs') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM audit_logs ORDER BY createdAt DESC, id DESC LIMIT 200");
        $rows = [];
        if ($result) {
            while($row = $result->fetch_assoc()) { $rows[] = $row; }
        }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO audit_logs (id, timestamp, user, action, module, details) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['timestamp'], $data['user'], $data['action'], $data['module'], $data['details']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE audit_logs SET timestamp=?, user=?, action=?, module=?, details=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['timestamp'], $data['user'], $data['action'], $data['module'], $data['details'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        if ($id === 'clear') {
            $stmt = $conn->prepare("TRUNCATE TABLE audit_logs");
        } else {
            $stmt = $conn->prepare("DELETE FROM audit_logs WHERE id=?");
            $stmt->bind_param("s", $id);
        }
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'whatsapp_logs') {
    if ($method === 'GET') {
        $rows = [];

        // Return ONLY the actual whatsapp_logs table records (outbound/CRM-sent messages).
        // The frontend WhatsAppLogView.js fetches whatsapp_incoming SEPARATELY via GET /whatsapp_incoming
        // and merges both client-side. Do NOT merge here to prevent duplicates and direction confusion.
        $result = $conn->query("SELECT * FROM `whatsapp_logs` ORDER BY createdAt ASC");
        if ($result) {
            while($row = $result->fetch_assoc()) {
                // Ensure both phone fields are populated
                $row['phone'] = $row['phone'] ?? ($row['phone_number'] ?? '');
                $row['phone_number'] = $row['phone_number'] ?? ($row['phone'] ?? '');
                $row['type'] = $row['type'] ?? ($row['direction'] ?? 'outbound');
                $row['direction'] = $row['direction'] ?? ($row['type'] ?? 'outbound');
                $rows[] = $row;
            }
        }

        echo json_encode($rows);
    }
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? ('WA-' . round(microtime(true) * 1000));
        $leadId = $data['leadId'] ?? null;
        $phone = $data['phone'] ?? ($data['phone_number'] ?? null);
        $message = $data['message'] ?? '';
        $sender = $data['sender'] ?? 'Super Admin';
        $recipientName = $data['recipientName'] ?? null;
        $type = $data['type'] ?? ($data['direction'] ?? 'outbound');
        $direction = $type;
        $status = $data['status'] ?? 'Delivered';

        $safe_id = $conn->real_escape_string($id);
        $safe_phone = $conn->real_escape_string($phone ?: '');
        $safe_msg = $conn->real_escape_string($message ?: '');
        $safe_sender = $conn->real_escape_string($sender ?: 'Super Admin');
        $safe_rec = $conn->real_escape_string($recipientName ?: '');
        $safe_dir = $conn->real_escape_string($direction ?: 'outbound');
        $safe_status = $conn->real_escape_string($status ?: 'Delivered');

        // Direct SQL insert guaranteed to work across any schema variation
        $sql = "INSERT INTO `whatsapp_logs` (`id`, `phone_number`, `phone`, `message`, `direction`, `type`, `sender`, `recipientName`, `status`) 
                VALUES ('$safe_id', '$safe_phone', '$safe_phone', '$safe_msg', '$safe_dir', '$safe_dir', '$safe_sender', '$safe_rec', '$safe_status')";
        
        if ($conn->query($sql)) {
            echo json_encode(["message" => "Created successfully", "id" => $id]);
        } else {
            // Fallback minimal insert
            $sql_min = "INSERT INTO `whatsapp_logs` (`id`, `phone_number`, `message`, `direction`, `status`) 
                        VALUES ('$safe_id', '$safe_phone', '$safe_msg', '$safe_dir', '$safe_status')";
            if ($conn->query($sql_min)) {
                echo json_encode(["message" => "Created successfully via fallback", "id" => $id]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database error: " . $conn->error]);
            }
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE whatsapp_logs SET sender=?, phone=?, message=? WHERE id=?");
        if ($stmt) {
            $stmt->bind_param("ssss", $data['sender'], $data['phone'], $data['message'], $id);
            $stmt->execute();
        }
        echo json_encode(["message" => "Updated successfully"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM whatsapp_logs WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'portal_users' || $resource === 'users') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM portal_users ORDER BY createdAt DESC");
        $rows = [];
        while($row = $result->fetch_assoc()) { 
            // Ensure frontend receives fullName even if DB column is name
            if (isset($row['name']) && !isset($row['fullName'])) {
                $row['fullName'] = $row['name'];
            }
            $rows[] = $row; 
        }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit;
        }

        $uId = strval($data['id'] ?? ('USR-' . time()));
        $uName = strval($data['fullName'] ?? 'User');
        $uEmail = strval($data['email'] ?? '');
        $uPhone = strval($data['phone'] ?? '');
        $pwd = strval($data['password'] ?? $data['temporaryPassword'] ?? '');
        $tempPwd = strval($data['temporaryPassword'] ?? '');
        $isTemp = !empty($data['isTemporaryPassword']) ? 1 : 0;
        $role = strval($data['role'] ?? 'Individual Owner');
        $roleCode = strval($data['roleCode'] ?? 'individualowner');
        $status = strval($data['status'] ?? 'Active');
        $propCount = intval($data['propertiesCount'] ?? 0);
        $visCount = intval($data['visitorsCount'] ?? 0);
        $buyCount = intval($data['buyersCount'] ?? 0);

        $stmt = $conn->prepare("INSERT INTO portal_users (id, fullName, email, phone, password, temporaryPassword, isTemporaryPassword, role, roleCode, status, propertiesCount, visitorsCount, buyersCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE fullName=VALUES(fullName), phone=VALUES(phone), password=VALUES(password), role=VALUES(role), roleCode=VALUES(roleCode), status=VALUES(status), propertiesCount=VALUES(propertiesCount), visitorsCount=VALUES(visitorsCount), buyersCount=VALUES(buyersCount)");
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Database prepare error: " . $conn->error]);
            exit;
        }

        $stmt->bind_param("ssssssisssiii", $uId, $uName, $uEmail, $uPhone, $pwd, $tempPwd, $isTemp, $role, $roleCode, $status, $propCount, $visCount, $buyCount);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Portal user created successfully", "id" => $uId]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database execute error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE portal_users SET fullName=?, email=?, phone=?, password=?, temporaryPassword=?, isTemporaryPassword=?, role=?, roleCode=?, status=?, propertiesCount=?, visitorsCount=?, buyersCount=? WHERE id=?");
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Database prepare error: " . $conn->error]);
            exit;
        }

        $pwd = $data['password'] ?? $data['temporaryPassword'] ?? '';
        $tempPwd = $data['temporaryPassword'] ?? '';
        $isTemp = !empty($data['isTemporaryPassword']) ? 1 : 0;
        $role = $data['role'] ?? 'Individual Owner';
        $roleCode = $data['roleCode'] ?? 'individualowner';
        $status = $data['status'] ?? 'Active';
        $propCount = intval($data['propertiesCount'] ?? 0);
        $visCount = intval($data['visitorsCount'] ?? 0);
        $buyCount = intval($data['buyersCount'] ?? 0);
        $uName = $data['fullName'] ?? 'User';
        
        $stmt->bind_param("sssssisssiiis", $uName, $data['email'], $data['phone'], $pwd, $tempPwd, $isTemp, $role, $roleCode, $status, $propCount, $visCount, $buyCount, $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Portal user updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM portal_users WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Portal user deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'site_images') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM site_images");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $conn->prepare("INSERT INTO site_images (id, image_key, url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE url = ?");
        $stmt->bind_param("ssss", $data['id'], $data['image_key'], $data['url'], $data['url']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created/Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

// =====================================================================
// WhatsApp Webhook (Meta / AiSensy / SmartPing Incoming Messages)
// Webhook URL: https://thanjaiproperty.com/api.php/webhook
// Verify Token: thanjai_webhook_2026
// =====================================================================
elseif ($resource === 'webhook') {
    // Step 1: Webhook verification handshake & health check (GET from Meta/SmartPing)
    if ($method === 'GET') {
        $VERIFY_TOKEN = 'thanjai_webhook_2026';
        $hub_mode      = $_GET['hub_mode'] ?? ($_GET['hub.mode'] ?? '');
        $hub_challenge = $_GET['hub_challenge'] ?? ($_GET['hub.challenge'] ?? '');
        $hub_verify    = $_GET['hub_verify_token'] ?? ($_GET['hub.verify_token'] ?? '');

        if ($hub_challenge) {
            http_response_code(200);
            header('Content-Type: text/plain');
            echo $hub_challenge;
            exit();
        }

        // Return 200 OK for any generic health check / ping from SmartPing
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            "status" => "active",
            "service" => "Thanjai Property WhatsApp Webhook",
            "url" => "https://thanjaiproperty.com/api.php/webhook",
            "time" => date('c')
        ]);
        exit();
    }

    // Step 2: Receive incoming WhatsApp messages (POST from Meta/AiSensy/SmartPing)
    if ($method === 'POST') {
        // Auto-create table if not exists
        $conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_incoming` (
            `id` bigint NOT NULL AUTO_INCREMENT,
            `from_phone` varchar(50) DEFAULT NULL,
            `from_name`  varchar(255) DEFAULT NULL,
            `message`    longtext,
            `media_url`  text,
            `message_type` varchar(50) DEFAULT 'text',
            `timestamp`  varchar(50) DEFAULT NULL,
            `raw_payload` longtext,
            `createdAt`  datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // RAW WEBHOOK LOG TABLE — captures everything, even unparseable payloads
        $conn->query("CREATE TABLE IF NOT EXISTS `webhook_raw_log` (
            `id` bigint NOT NULL AUTO_INCREMENT,
            `method` varchar(10) DEFAULT NULL,
            `headers` text,
            `body` longtext,
            `ip` varchar(64) DEFAULT NULL,
            `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $raw = file_get_contents("php://input");

        // Log ALL incoming payloads verbatim so we can see what SmartPing actually sends
        $safe_raw_log = $conn->real_escape_string(substr($raw ?: '(empty body)', 0, 65000));
        $req_headers = [];
        foreach ($_SERVER as $k => $v) {
            if (strpos($k, 'HTTP_') === 0) $req_headers[substr($k, 5)] = $v;
        }
        $req_headers['CONTENT_TYPE'] = $_SERVER['CONTENT_TYPE'] ?? '';
        $req_headers['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] ?? '';
        $safe_hdrs = $conn->real_escape_string(json_encode($req_headers));
        $safe_ip = $conn->real_escape_string($_SERVER['REMOTE_ADDR'] ?? '');
        $conn->query("INSERT INTO `webhook_raw_log` (`method`, `headers`, `body`, `ip`) VALUES ('POST', '$safe_hdrs', '$safe_raw_log', '$safe_ip')");

        $data = json_decode($raw, true);

        // Fallback to $_POST if payload was sent as form data
        if (!$data && !empty($_POST)) {
            $data = $_POST;
            $raw = json_encode($_POST);
        }


        // Filter out status updates / delivery receipts / echoes from SmartPing
        $topic = $data['topic'] ?? '';
        if ($topic === 'message.status.updated' || $topic === 'message.status' || $topic === 'message.sent' || $topic === 'message.delivered' || $topic === 'message.read') {
            http_response_code(200);
            echo json_encode(["status" => "status_update_ignored"]);
            exit();
        }

        // Parse incoming message payloads (SmartPing / AiSensy / Meta / Custom)
        $from_phone = '';
        $from_name  = '';
        $message    = '';
        $media_url  = '';
        $msg_type   = 'text';
        $timestamp  = date('c');

        // 1. SMARTPING OFFICIAL WEBHOOK FORMAT (topic = "message.sender.user", data.message object)
        if (isset($data['data']['message']) && is_array($data['data']['message'])) {
            $spMsg = $data['data']['message'];
            
            // Only process messages sent by real humans (USER). Ignore API/BOT/SYSTEM echoes.
            $senderType = strtoupper($spMsg['sender'] ?? 'USER');
            if ($senderType !== 'USER' && $senderType !== '') {
                http_response_code(200);
                echo json_encode(["status" => "non_user_message_ignored"]);
                exit();
            }

            $from_phone = $spMsg['phone_number'] ?? ($spMsg['from'] ?? ($spMsg['sender'] ?? ''));
            $from_name  = $spMsg['userName'] ?? ($spMsg['name'] ?? $from_phone);
            $msg_type   = strtolower($spMsg['message_type'] ?? ($spMsg['type'] ?? 'text'));
            
            // SmartPing message_content can be an object with text/caption or a raw string
            if (isset($spMsg['message_content']) && is_array($spMsg['message_content'])) {
                $message   = $spMsg['message_content']['text'] ?? ($spMsg['message_content']['caption'] ?? ($spMsg['message_content']['title'] ?? ''));
                $media_url = $spMsg['message_content']['media_url'] ?? ($spMsg['message_content']['url'] ?? ($spMsg['message_content']['file_url'] ?? ''));
            } elseif (isset($spMsg['message_content']) && is_string($spMsg['message_content'])) {
                $message = $spMsg['message_content'];
            } elseif (isset($spMsg['text']) && is_string($spMsg['text'])) {
                $message = $spMsg['text'];
            } elseif (isset($spMsg['message']) && is_string($spMsg['message'])) {
                $message = $spMsg['message'];
            }
            if (isset($spMsg['sent_at'])) {
                $timestamp = date('c', intval($spMsg['sent_at'] / 1000));
            }
        }
        // 2. Meta Cloud API format
        elseif (isset($data['entry'][0]['changes'][0]['value']['messages'][0])) {
            $msg = $data['entry'][0]['changes'][0]['value']['messages'][0];
            $contact = $data['entry'][0]['changes'][0]['value']['contacts'][0] ?? [];
            $from_phone = $msg['from'] ?? '';
            $from_name  = $contact['profile']['name'] ?? $from_phone;
            $timestamp  = isset($msg['timestamp']) ? date('c', intval($msg['timestamp'])) : date('c');
            $msg_type   = $msg['type'] ?? 'text';

            if ($msg_type === 'text') {
                $message = $msg['text']['body'] ?? '';
            } elseif (in_array($msg_type, ['image', 'video', 'audio', 'document'])) {
                $media = $msg[$msg_type] ?? [];
                $media_url = $media['url'] ?? ($media['id'] ?? '');
                $message = $media['caption'] ?? ("[$msg_type received]");
            } elseif ($msg_type === 'interactive') {
                $message = $msg['interactive']['button_reply']['title'] 
                        ?? $msg['interactive']['list_reply']['title'] 
                        ?? '[Interactive reply]';
            } elseif ($msg_type === 'button') {
                $message = $msg['button']['text'] ?? '[Button reply]';
            } else {
                $message = "[{$msg_type} received]";
            }
        }
        // 3. Generic / AiSensy flat or nested JSON format
        else {
            $from_phone = $data['from'] ?? ($data['sender'] ?? ($data['phone'] ?? ($data['mobile'] ?? ($data['waId'] ?? ($data['destination'] ?? '')))));
            $from_name  = $data['name'] ?? ($data['userName'] ?? ($data['from_name'] ?? ($data['contactName'] ?? '')));
            
            // Check nested wrappers like $data['data'], $data['payload'], $data['contact']
            $nested = $data['data'] ?? ($data['payload'] ?? ($data['contact'] ?? []));
            if (is_array($nested)) {
                if (empty($from_phone)) {
                    $from_phone = $nested['from'] ?? ($nested['sender'] ?? ($nested['phone'] ?? ($nested['phone_number'] ?? ($nested['mobile'] ?? ($nested['waId'] ?? ($nested['destination'] ?? ''))))));
                }
                if (empty($from_name)) {
                    $from_name = $nested['name'] ?? ($nested['userName'] ?? ($nested['from_name'] ?? ($nested['contactName'] ?? '')));
                }
            }

            // Extract text message
            if (isset($data['text']) && is_string($data['text'])) {
                $message = $data['text'];
            } elseif (isset($data['message']) && is_string($data['message'])) {
                $message = $data['message'];
            } elseif (isset($data['body']) && is_string($data['body'])) {
                $message = $data['body'];
            } elseif (isset($data['msg']) && is_string($data['msg'])) {
                $message = $data['msg'];
            } elseif (isset($data['content']) && is_string($data['content'])) {
                $message = $data['content'];
            } elseif (isset($nested['text']) && is_string($nested['text'])) {
                $message = $nested['text'];
            } elseif (isset($nested['message']) && is_string($nested['message'])) {
                $message = $nested['message'];
            } elseif (isset($nested['body']) && is_string($nested['body'])) {
                $message = $nested['body'];
            } elseif (isset($data['button']['text'])) {
                $message = $data['button']['text'];
            } elseif (isset($data['text']['body'])) {
                $message = $data['text']['body'];
            } else {
                $message = is_array($data['message'] ?? null) ? json_encode($data['message']) : ($data['text'] ?? '');
            }
            
            $timestamp  = $data['timestamp'] ?? ($data['time'] ?? ($nested['timestamp'] ?? ($nested['time'] ?? date('c'))));
            $msg_type   = $data['type'] ?? ($data['messageType'] ?? ($nested['type'] ?? 'text'));
            $media_url  = $data['mediaUrl'] ?? ($data['url'] ?? ($data['media']['url'] ?? ($nested['mediaUrl'] ?? '')));
            if (empty($from_name)) $from_name = $from_phone;
        }

        // Auto-create unified whatsapp_messages table
        $conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_messages` (
            `id` bigint NOT NULL AUTO_INCREMENT,
            `direction` varchar(10) DEFAULT 'inbound',
            `customer_phone` varchar(20) DEFAULT NULL,
            `customer_name` varchar(255) DEFAULT NULL,
            `message` longtext,
            `media_url` text,
            `message_type` varchar(20) DEFAULT 'text',
            `source` varchar(30) DEFAULT 'smartping',
            `raw_payload` longtext,
            `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_phone` (`customer_phone`),
            KEY `idx_createdAt` (`createdAt`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        if ($from_phone) {
            // Clean & format phone
            $clean_phone = preg_replace('/\D/', '', $from_phone);
            $last10 = substr($clean_phone, -10);
            $formattedPhone = (strlen($clean_phone) === 10) ? '+91' . $clean_phone : (str_starts_with($from_phone, '+') ? $from_phone : '+' . $clean_phone);
            $displayName = !empty($from_name) ? $from_name : "Customer ($last10)";

            $safe_in_phone = $conn->real_escape_string($formattedPhone);
            $safe_in_msg = $conn->real_escape_string($message);
            $safe_in_sender = $conn->real_escape_string($displayName);

            // Deduplication Check: Skip identical message from same phone received in last 10 seconds
            $dupCheck = $conn->query("SELECT id FROM `whatsapp_messages` WHERE `customer_phone`='$safe_in_phone' AND `message`='$safe_in_msg' AND `direction`='inbound' AND `createdAt` >= (NOW() - INTERVAL 10 SECOND) LIMIT 1");
            if ($dupCheck && $dupCheck->num_rows > 0) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Duplicate webhook delivery skipped"]);
                exit();
            }

            // 1. Insert into unified whatsapp_messages (inbound)
            $safe_media = $conn->real_escape_string($media_url ?: '');
            $safe_type = $conn->real_escape_string($msg_type ?: 'text');
            $safe_raw = $conn->real_escape_string($raw ?: '');

            $conn->query("INSERT INTO `whatsapp_messages` (`direction`, `customer_phone`, `customer_name`, `message`, `media_url`, `message_type`, `source`, `raw_payload`) VALUES ('inbound', '$safe_in_phone', '$safe_in_sender', '$safe_in_msg', '$safe_media', '$safe_type', 'smartping', '$safe_raw')");

            // Also insert into legacy whatsapp_incoming for backward compat
            $sql_inc = "INSERT INTO `whatsapp_incoming` (`from_phone`, `from_name`, `message`, `media_url`, `message_type`, `timestamp`, `raw_payload`)
                        VALUES ('$safe_in_phone', '$safe_in_sender', '$safe_in_msg', '$safe_media', '$safe_type', '$safe_in_phone', '$safe_raw')";
            $conn->query($sql_inc);


            // 2. Match or Create Lead in CRM Pipeline
            $matchedLeadId = null;
            $isNewLead = true;
            $leads_raw = $conn->query("SELECT id, phone, timeline FROM leads");
            if ($leads_raw) {
                while ($lead = $leads_raw->fetch_assoc()) {
                    $lead_phone = preg_replace('/\D/', '', $lead['phone'] ?? '');
                    if (substr($lead_phone, -10) === $last10) {
                        $matchedLeadId = $lead['id'];
                        $isNewLead = false;
                        $timeline = json_decode($lead['timeline'] ?? '[]', true) ?: [];
                        array_unshift($timeline, [
                            'type'    => 'whatsapp_incoming',
                            'date'    => date('c'),
                            'message' => "📩 Customer replied: \"$message\"",
                            'note'    => $message
                        ]);
                        $new_timeline = json_encode($timeline);
                        $upd = $conn->prepare("UPDATE leads SET timeline=? WHERE id=?");
                        if ($upd) {
                            $upd->bind_param("ss", $new_timeline, $lead['id']);
                            $upd->execute();
                        }
                        break;
                    }
                }
            }

            // If contact is not yet in leads, auto-create a new lead in CRM Pipeline
            if ($isNewLead && strlen($last10) >= 10) {
                $newLeadId = 'L-' . rand(1000, 9999);
                $matchedLeadId = $newLeadId;
                $initialTimeline = json_encode([
                    [
                        'type'    => 'whatsapp_incoming',
                        'date'    => date('c'),
                        'message' => "📩 Inbound WhatsApp Lead: \"$message\"",
                        'note'    => $message
                    ]
                ]);
                $leadSource = 'WhatsApp Inbound';
                $leadStage = 'New Lead';
                $leadBudget = 'To be discussed';
                $leadReq = 'Inbound WhatsApp Inquiry';

                // Assign to active staff if available
                $staffRes = $conn->query("SELECT fullName FROM admin_staff WHERE status='Active' LIMIT 1");
                $assignedStaff = ($staffRes && $staffRow = $staffRes->fetch_assoc()) ? $staffRow['fullName'] : 'Kavitha R.';
                $todayDate = date('Y-m-d');

                $insLead = $conn->prepare("INSERT INTO leads (id, name, phone, email, type, location, budget, stage, timeline, source, date, assignedTo, priority) VALUES (?, ?, ?, '', ?, 'Thanjavur', ?, ?, ?, ?, ?, ?, 'Medium')");
                if ($insLead) {
                    $insLead->bind_param("ssssssssss", $newLeadId, $displayName, $formattedPhone, $leadReq, $leadBudget, $leadStage, $initialTimeline, $leadSource, $todayDate, $assignedStaff);
                    $insLead->execute();
                }
            }

            // 3. Send Official Welcome Message EXACTLY ONCE (Strict 24-Hour Cooldown)
            $lowerMsg = strtolower(trim($message));
            $isGreeting = preg_match('/^(hi|hello|hey|vanakkam|வணக்கம்|good\s*(morning|afternoon|evening)|namaste|start|info|details|property|enquiry|hai|hlo)/i', $lowerMsg) || $isNewLead;

            if ($isGreeting) {
                // Rate-limit check: Send welcome message at most ONCE every 24 hours per phone number
                $welcomeCheck = $conn->query("SELECT id FROM `whatsapp_messages` WHERE `customer_phone`='$safe_in_phone' AND `direction`='outbound' AND `source`='auto_welcome' AND `createdAt` >= (NOW() - INTERVAL 24 HOUR) LIMIT 1");
                
                if (!$welcomeCheck || $welcomeCheck->num_rows === 0) {
                    $MASTER_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjYxNjVmODFhMDg2MTIzZWY5MWQ5MCIsIm5hbWUiOiJUaGFuamFpIFByb3BlcnR5IiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY5NjYxNjVmODFhMDg2MTIzZWY5MWQ4OSIsImFjdGl2ZVBsYW4iOiJQUk9fTU9OVEhMWSIsImlhdCI6MTc4NzcyNDczOX0.8SQSQDJdxrAivj8FAkWvjSk_qx4yE0dENDh70US75G0';

                    $apiKey = '';
                    $setRes = $conn->query("SELECT setting_value FROM settings WHERE setting_key='whatsapp_integration'");
                    if ($setRes && $setRow = $setRes->fetch_assoc()) {
                        $waSet = json_decode($setRow['setting_value'], true);
                        $apiKey = $waSet['apiKey'] ?? '';
                    }
                    if (empty($apiKey)) {
                        $apiKey = $MASTER_API_KEY;
                    }

                    $cleanName = preg_replace('/[^\p{L}\p{N}\s]/u', '', $displayName) ?: 'Customer';
                    $welcomeText = "Vanakkam $displayName! 🙏\n\nThank you for contacting Thanjai Property!\n\nWe have been dealing in properties since 2009, bridging the gap between genuine buyers and clear-title property owners.\n\nWhat type of property are you looking for right now?\n\n• DTCP Plots / Land\n• Independent House / Villa / Apartment\n• Farmland / Agriculture / Commercial Land / Building\n\nReply with your choice, and we'll share the best options with you!\n\nBest regards,\n*Thanjai Property Team*\n📞 +91 84899 96852";

                    $campaignName = 'welcome_message';
                    $stringParams = [(string)$cleanName];

                    // Dispatch to SmartPing
                    $smartPingUrl = 'https://backend.api-wa.co/campaign/smartping/api/v2';
                    $payload = json_encode([
                        'apiKey' => $apiKey,
                        'campaignName' => $campaignName,
                        'destination' => $formattedPhone,
                        'userName' => (string)$displayName,
                        'templateParams' => $stringParams
                    ]);

                    $ch = curl_init($smartPingUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
                    $resSp = curl_exec($ch);
                    curl_close($ch);

                    // Fallback to AiSensy if needed
                    $resSpJson = json_decode($resSp, true);
                    if (($resSpJson['status'] ?? '') !== 'success' && !($resSpJson['submitted_message_id'] ?? false)) {
                        $aiSensyUrl = 'https://backend.aisensy.com/campaign/t1/api/v2';
                        $payloadAi = json_encode([
                            'apiKey' => $apiKey,
                            'campaignName' => $campaignName,
                            'destination' => '91' . $last10,
                            'userName' => (string)$displayName,
                            'templateParams' => $stringParams
                        ]);
                        $ch2 = curl_init($aiSensyUrl);
                        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch2, CURLOPT_POST, true);
                        curl_setopt($ch2, CURLOPT_POSTFIELDS, $payloadAi);
                        curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                        curl_setopt($ch2, CURLOPT_TIMEOUT, 8);
                        curl_exec($ch2);
                        curl_close($ch2);
                    }

                    // Record outbound welcome message in unified table
                    $safe_out_phone = $conn->real_escape_string($formattedPhone);
                    $safe_out_msg = $conn->real_escape_string($welcomeText);
                    $safe_out_disp = $conn->real_escape_string($displayName);
                    $conn->query("INSERT INTO `whatsapp_messages` (`direction`, `customer_phone`, `customer_name`, `message`, `source`) VALUES ('outbound', '$safe_out_phone', '$safe_out_disp', '$safe_out_msg', 'auto_welcome')");
                }
            }
        }

        http_response_code(200);
        echo json_encode(["status" => "received"]);
        exit();
    }
}

// Fetch all incoming WhatsApp messages (for CRM display)
elseif ($resource === 'whatsapp_incoming') {
    // Auto-create table if not exists
    $conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_incoming` (
        `id` bigint NOT NULL AUTO_INCREMENT,
        `from_phone` varchar(50) DEFAULT NULL,
        `from_name`  varchar(255) DEFAULT NULL,
        `message`    longtext,
        `media_url`  text,
        `message_type` varchar(50) DEFAULT 'text',
        `timestamp`  varchar(50) DEFAULT NULL,
        `raw_payload` longtext,
        `createdAt`  datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    if ($method === 'GET') {
        $phone_filter = isset($_GET['phone']) ? $_GET['phone'] : null;
        if ($phone_filter) {
            $clean = preg_replace('/\D/', '', $phone_filter);
            $last10 = substr($clean, -10);
            $result = $conn->query("SELECT * FROM whatsapp_incoming WHERE from_phone LIKE '%{$last10}' ORDER BY createdAt ASC");
        } else {
            $result = $conn->query("SELECT * FROM whatsapp_incoming ORDER BY createdAt DESC LIMIT 200");
        }
        $rows = [];
        while ($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    }
    elseif ($method === 'DELETE') {
        $del_id = intval($_GET['id'] ?? 0);
        if ($del_id > 0) {
            $conn->query("DELETE FROM `whatsapp_incoming` WHERE `id` = $del_id");
            echo json_encode(["message" => "Deleted row $del_id"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "id required"]);
        }
    }
}

// Read raw webhook logs — so we can see exactly what SmartPing sends
elseif ($resource === 'webhook_raw_log') {
    if ($method === 'GET') {
        $conn->query("CREATE TABLE IF NOT EXISTS `webhook_raw_log` (
            `id` bigint NOT NULL AUTO_INCREMENT,
            `method` varchar(10) DEFAULT NULL,
            `headers` text,
            `body` longtext,
            `ip` varchar(64) DEFAULT NULL,
            `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
        $result = $conn->query("SELECT `id`,`method`,`ip`,`createdAt`, SUBSTR(`body`,1,1000) as body_preview FROM `webhook_raw_log` ORDER BY `id` DESC LIMIT $limit");
        $rows = [];
        if ($result) { while ($row = $result->fetch_assoc()) { $rows[] = $row; } }
        echo json_encode($rows);
    }
}

// UNIFIED WhatsApp Messages — single clean table for all inbound + outbound
elseif ($resource === 'whatsapp_messages') {
    $conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_messages` (
        `id` bigint NOT NULL AUTO_INCREMENT,
        `direction` varchar(10) DEFAULT 'inbound',
        `customer_phone` varchar(20) DEFAULT NULL,
        `customer_name` varchar(255) DEFAULT NULL,
        `message` longtext,
        `media_url` text,
        `message_type` varchar(20) DEFAULT 'text',
        `source` varchar(30) DEFAULT 'smartping',
        `raw_payload` longtext,
        `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_phone` (`customer_phone`),
        KEY `idx_createdAt` (`createdAt`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    if ($method === 'GET') {
        $phone_filter = $_GET['phone'] ?? null;
        if ($phone_filter) {
            $clean = preg_replace('/\D/', '', $phone_filter);
            $last10 = substr($clean, -10);
            $result = $conn->query("SELECT `id`,`direction`,`customer_phone`,`customer_name`,`message`,`media_url`,`message_type`,`source`,`createdAt` FROM `whatsapp_messages` WHERE `customer_phone` LIKE '%{$last10}' ORDER BY `createdAt` ASC");
        } else {
            $result = $conn->query("SELECT `id`,`direction`,`customer_phone`,`customer_name`,`message`,`media_url`,`message_type`,`source`,`createdAt` FROM `whatsapp_messages` ORDER BY `createdAt` DESC LIMIT 500");
        }
        $rows = [];
        if ($result) { while ($row = $result->fetch_assoc()) { $rows[] = $row; } }
        echo json_encode($rows);
    }
    elseif ($method === 'DELETE') {
        $del_id = intval($_GET['id'] ?? 0);
        if ($del_id > 0) {
            $conn->query("DELETE FROM `whatsapp_messages` WHERE `id` = $del_id");
            echo json_encode(["message" => "Deleted row $del_id"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "id required"]);
        }
    }
}

$conn->close();
?>