<html>
<body>
sent 1 token to address: 
<?php 
require_once __DIR__ . '/vendor/autoload.php'; // Autoload files using Composer autoload
$client = \Softonic\GraphQL\ClientBuilder::build('http://tokenissuer:1337/graphql');

$query = <<<'QUERY'
query GetToken($userAddress: String) {
    issueToken(address: $userAddress) {
          address
          token
          status
    }
}
QUERY;

$variables = [
    'userAddress' => $_POST["address"]
];
$response = $client->query($query, $variables);
print_r($response->getData()['address']);

echo $_POST["address"]; ?>
</body>
</html>
