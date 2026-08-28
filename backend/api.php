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

@$conn->query("CREATE TABLE IF NOT EXISTS `property_approvals` (
  `id` varchar(255) PRIMARY KEY,
  `propertyTitle` varchar(255) DEFAULT NULL,
  `ownerName` varchar(255) DEFAULT NULL,
  `ownerPhone` varchar(50) DEFAULT NULL,
  `ownerEmail` varchar(255) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `propertyType` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending Approval',
  `details` longtext DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");

@$conn->query("CREATE TABLE IF NOT EXISTS `whatsapp_logs` (
  `id` varchar(255) PRIMARY KEY,
  `leadId` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `type` varchar(50) DEFAULT 'outbound',
  `status` varchar(50) DEFAULT 'Delivered',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");

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

@$conn->query("CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` varchar(255) PRIMARY KEY,
  `timestamp` varchar(100) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `module` varchar(100) DEFAULT 'General',
  `details` text DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
)");

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

addCol($conn, 'property_approvals', 'propertyTitle', 'varchar(255) DEFAULT NULL');
addCol($conn, 'property_approvals', 'ownerName', 'varchar(255) DEFAULT NULL');
addCol($conn, 'property_approvals', 'ownerPhone', 'varchar(50) DEFAULT NULL');
addCol($conn, 'property_approvals', 'ownerEmail', 'varchar(255) DEFAULT NULL');
addCol($conn, 'property_approvals', 'price', 'varchar(100) DEFAULT NULL');
addCol($conn, 'property_approvals', 'location', 'varchar(255) DEFAULT NULL');
addCol($conn, 'property_approvals', 'propertyType', 'varchar(100) DEFAULT NULL');
addCol($conn, 'property_approvals', 'status', 'varchar(50) DEFAULT "Pending Approval"');
addCol($conn, 'property_approvals', 'details', 'longtext DEFAULT NULL');

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

$tables = ['dashboard_stats', 'leads', 'properties', 'property_approvals', 'site_visits', 'partners', 'ai_logs', 'whatsapp_logs', 'pipeline_stages', 'reports', 'portal_users', 'audit_logs'];
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

if ($resource === 'properties') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM properties ORDER BY createdAt DESC");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO properties (id, title, type, category, categoryRaw, categoryLabel, purpose, price, priceFormatted, location, district, address, size, bedrooms, bathrooms, furnishing, status, availability, latitude, longitude, videoUrl, ownerName, ownerPhone, listedBy, adType, images, description, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $images = json_encode($data['images'] ?? []);
        $features = json_encode($data['features'] ?? []);
        $adType = $data['adType'] ?? 'free';
        $stmt->bind_param("sssssssdsssssiisssssssssssss", $data['id'], $data['title'], $data['type'], $data['category'], $data['categoryRaw'], $data['categoryLabel'], $data['purpose'], $data['price'], $data['priceFormatted'], $data['location'], $data['district'], $data['address'], $data['size'], $data['bedrooms'], $data['bathrooms'], $data['furnishing'], $data['status'], $data['availability'], $data['latitude'], $data['longitude'], $data['videoUrl'], $data['ownerName'], $data['ownerPhone'], $data['listedBy'], $adType, $images, $data['description'], $features);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Property created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE properties SET title=?, type=?, category=?, categoryRaw=?, categoryLabel=?, purpose=?, price=?, priceFormatted=?, location=?, district=?, address=?, size=?, bedrooms=?, bathrooms=?, furnishing=?, status=?, availability=?, latitude=?, longitude=?, videoUrl=?, ownerName=?, ownerPhone=?, listedBy=?, adType=?, images=?, description=?, features=? WHERE id=?");
        $images = json_encode($data['images'] ?? []);
        $features = json_encode($data['features'] ?? []);
        $adType = $data['adType'] ?? 'free';
        $stmt->bind_param("sssssssdsssssiissssssssssssss", $data['title'], $data['type'], $data['category'], $data['categoryRaw'], $data['categoryLabel'], $data['purpose'], $data['price'], $data['priceFormatted'], $data['location'], $data['district'], $data['address'], $data['size'], $data['bedrooms'], $data['bathrooms'], $data['furnishing'], $data['status'], $data['availability'], $data['latitude'], $data['longitude'], $data['videoUrl'], $data['ownerName'], $data['ownerPhone'], $data['listedBy'], $adType, $images, $data['description'], $features, $id);
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
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $conn->prepare("INSERT INTO partners (id, name, type, contactPerson, phone, whatsapp, email, city, country, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $name = $data['name'] ?? ($data['company'] ?? '');
        $type = $data['type'] ?? ($data['contact'] ?? '');
        $contactPerson = $data['contactPerson'] ?? ($data['contact'] ?? '');
        $phone = $data['phone'] ?? '';
        $whatsapp = $data['whatsapp'] ?? $phone;
        $email = $data['email'] ?? '';
        $city = $data['city'] ?? 'Thanjavur';
        $country = $data['country'] ?? 'India';
        $status = $data['status'] ?? 'Active';
        $notes = $data['notes'] ?? '';
        
        $stmt->bind_param("sssssssssss", $data['id'], $name, $type, $contactPerson, $phone, $whatsapp, $email, $city, $country, $status, $notes);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $conn->prepare("UPDATE partners SET name=?, type=?, contactPerson=?, phone=?, whatsapp=?, email=?, city=?, country=?, status=?, notes=? WHERE id=?");
        $name = $data['name'] ?? ($data['company'] ?? '');
        $type = $data['type'] ?? ($data['contact'] ?? '');
        $contactPerson = $data['contactPerson'] ?? ($data['contact'] ?? '');
        $phone = $data['phone'] ?? '';
        $whatsapp = $data['whatsapp'] ?? $phone;
        $email = $data['email'] ?? '';
        $city = $data['city'] ?? 'Thanjavur';
        $country = $data['country'] ?? 'India';
        $status = $data['status'] ?? 'Active';
        $notes = $data['notes'] ?? '';

        $stmt->bind_param("sssssssssss", $name, $type, $contactPerson, $phone, $whatsapp, $email, $city, $country, $status, $notes, $id);
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

elseif ($resource === 'shared_leads') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM shared_leads");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO shared_leads (id, leadId, partnerId, status) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $data['id'], $data['leadId'], $data['partnerId'], $data['status']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE shared_leads SET leadId=?, partnerId=?, status=? WHERE id=?");
        $stmt->bind_param("ssss", $data['leadId'], $data['partnerId'], $data['status'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM shared_leads WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
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
        $result = $conn->query("SELECT * FROM whatsapp_logs ORDER BY createdAt ASC");
        $rows = [];
        if ($result) {
            while($row = $result->fetch_assoc()) { $rows[] = $row; }
        }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? ('WA-' . round(microtime(true) * 1000));
        $leadId = $data['leadId'] ?? null;
        $phone = $data['phone'] ?? null;
        $message = $data['message'] ?? '';
        $sender = $data['sender'] ?? 'Super Admin';
        $recipientName = $data['recipientName'] ?? null;
        $type = $data['type'] ?? 'outbound';
        $status = $data['status'] ?? 'Delivered';
        
        $stmt = $conn->prepare("INSERT INTO whatsapp_logs (id, leadId, phone, message, sender, recipientName, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("ssssssss", $id, $leadId, $phone, $message, $sender, $recipientName, $type, $status);
            $stmt->execute();
        } else {
            // Fallback insert
            $stmt2 = $conn->prepare("INSERT INTO whatsapp_logs (id, phone, message) VALUES (?, ?, ?)");
            if ($stmt2) {
                $stmt2->bind_param("sss", $id, $phone, $message);
                $stmt2->execute();
            }
        }
        echo json_encode(["message" => "Created successfully", "id" => $id]);
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
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
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
        $stmt->bind_param("ssssssisssiii", $uId, $uName, $uEmail, $uPhone, $pwd, $tempPwd, $isTemp, $role, $roleCode, $status, $propCount, $visCount, $buyCount);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Portal user created successfully", "id" => $uId]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE portal_users SET fullName=?, email=?, phone=?, password=?, temporaryPassword=?, isTemporaryPassword=?, role=?, roleCode=?, status=?, propertiesCount=?, visitorsCount=?, buyersCount=? WHERE id=?");
        $pwd = $data['password'] ?? $data['temporaryPassword'] ?? '';
        $tempPwd = $data['temporaryPassword'] ?? '';
        $isTemp = !empty($data['isTemporaryPassword']) ? 1 : 0;
        $role = $data['role'] ?? 'Individual Owner';
        $roleCode = $data['roleCode'] ?? 'individualowner';
        $status = $data['status'] ?? 'Active';
        $propCount = intval($data['propertiesCount'] ?? 0);
        $visCount = intval($data['visitorsCount'] ?? 0);
        $buyCount = intval($data['buyersCount'] ?? 0);
        $stmt->bind_param("sssssisssiiis", $data['fullName'], $data['email'], $data['phone'], $pwd, $tempPwd, $isTemp, $role, $roleCode, $status, $propCount, $visCount, $buyCount, $id);
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

elseif ($resource === 'property_approvals') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM property_approvals");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO property_approvals (id, propertyId, requestedBy, status, comments) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $data['id'], $data['propertyId'], $data['requestedBy'], $data['status'], $data['comments']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE property_approvals SET propertyId=?, requestedBy=?, status=?, comments=? WHERE id=?");
        $stmt->bind_param("sssss", $data['propertyId'], $data['requestedBy'], $data['status'], $data['comments'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM property_approvals WHERE id=?");
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
    // Step 1: Webhook verification handshake (GET from Meta)
    if ($method === 'GET') {
        $VERIFY_TOKEN = 'thanjai_webhook_2026';
        $hub_mode      = isset($_GET['hub_mode'])      ? $_GET['hub_mode']      : '';
        $hub_challenge = isset($_GET['hub_challenge'])  ? $_GET['hub_challenge']  : '';
        $hub_verify    = isset($_GET['hub_verify_token']) ? $_GET['hub_verify_token'] : '';

        if ($hub_mode === 'subscribe' && $hub_verify === $VERIFY_TOKEN) {
            http_response_code(200);
            header('Content-Type: text/plain');
            echo $hub_challenge;
        } else {
            http_response_code(403);
            echo 'Forbidden';
        }
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

        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        // Parse Meta Cloud API format
        $from_phone = '';
        $from_name  = '';
        $message    = '';
        $media_url  = '';
        $msg_type   = 'text';
        $timestamp  = '';

        // 1. Meta Cloud API format
        if (isset($data['entry'][0]['changes'][0]['value']['messages'][0])) {
            $msg = $data['entry'][0]['changes'][0]['value']['messages'][0];
            $contact = $data['entry'][0]['changes'][0]['value']['contacts'][0] ?? [];
            $from_phone = $msg['from'] ?? '';
            $from_name  = $contact['profile']['name'] ?? $from_phone;
            $timestamp  = $msg['timestamp'] ?? '';
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
        // 2. Generic / SmartPing / AiSensy flat or nested JSON format
        else {
            $from_phone = $data['from'] ?? ($data['sender'] ?? ($data['phone'] ?? ($data['mobile'] ?? ($data['waId'] ?? ($data['destination'] ?? '')))));
            $from_name  = $data['name'] ?? ($data['userName'] ?? ($data['from_name'] ?? ($data['contactName'] ?? $from_phone)));
            
            // Extract text message from various formats
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
            } elseif (isset($data['button']['text'])) {
                $message = $data['button']['text'];
            } elseif (isset($data['text']['body'])) {
                $message = $data['text']['body'];
            } else {
                $message = is_array($data['message'] ?? null) ? json_encode($data['message']) : ($data['text'] ?? '');
            }
            
            $timestamp  = $data['timestamp'] ?? ($data['time'] ?? date('c'));
            $msg_type   = $data['type'] ?? ($data['messageType'] ?? 'text');
            $media_url  = $data['mediaUrl'] ?? ($data['url'] ?? ($data['media']['url'] ?? ''));
        }

        if ($from_phone) {
            $stmt = $conn->prepare("INSERT INTO whatsapp_incoming (from_phone, from_name, message, media_url, message_type, timestamp, raw_payload) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $from_phone, $from_name, $message, $media_url, $msg_type, $timestamp, $raw);
            $stmt->execute();

            // Also try to match to a lead and append to their timeline
            $clean_phone = preg_replace('/\D/', '', $from_phone);
            $last10 = substr($clean_phone, -10);
            $leads_raw = $conn->query("SELECT * FROM leads");
            while ($lead = $leads_raw->fetch_assoc()) {
                $lead_phone = preg_replace('/\D/', '', $lead['phone'] ?? '');
                if (substr($lead_phone, -10) === $last10) {
                    $timeline = json_decode($lead['timeline'] ?? '[]', true) ?: [];
                    array_unshift($timeline, [
                        'type'    => 'whatsapp_incoming',
                        'date'    => date('c'),
                        'message' => "📩 Customer replied: \"$message\"",
                        'note'    => $message
                    ]);
                    $new_timeline = json_encode($timeline);
                    $upd = $conn->prepare("UPDATE leads SET timeline=? WHERE id=?");
                    $upd->bind_param("ss", $new_timeline, $lead['id']);
                    $upd->execute();
                    break;
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
}

$conn->close();
?>