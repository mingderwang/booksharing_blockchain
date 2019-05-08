pragma solidity ^0.5.0;

contract a {

    address private contract_address;
    event AACalled(bool success);
    
    constructor() public {
        contract_address = 0x6CeF29Ff08C76fde1788EDCE0Ef00773106835e7; //b合約地址
    }
   
    function transfer_by_owner(address from, address to) public {
    (bool success,) = contract_address.call(abi.encodeWithSignature("transfer_by_owner(address, address)", from, to));
     emit AACalled(success);
    }
     
}
