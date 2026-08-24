<?php
// send_lead.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$name = isset($data['name']) ? $data['name'] : 'Unknown';
$phone = isset($data['phone']) ? $data['phone'] : 'Unknown';
$email = isset($data['email']) ? $data['email'] : 'Not provided';
$type = isset($data['type']) ? $data['type'] : 'Not specified';
$budget = isset($data['budget']) ? $data['budget'] : 'Not specified';
$location = isset($data['location']) ? $data['location'] : 'Not specified';

$to = 'vijayaraghavan@thanjaiproperty.com';
$subject = 'New Property Lead - ' . $name;

$message = "You have received a new lead from Thanjai Property website.\n\n";
$message .= "Name: " . $name . "\n";
$message .= "Phone: " . $phone . "\n";
$message .= "Email: " . $email . "\n";
$message .= "Requirement: " . $type . "\n";
$message .= "Location: " . $location . "\n";
$message .= "Budget: " . $budget . "\n\n";
$message .= "Date: " . date('Y-m-d H:i:s') . "\n";

$headers = 'From: noreply@thanjaiproperty.com' . "\r\n" .
    'Reply-To: ' . $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

$mailSent = @mail($to, $subject, $message, $headers);

echo json_encode(['success' => $mailSent]);
?>
