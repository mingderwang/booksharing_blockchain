pragma solidity ^0.5.0;

interface ERC20_interface {
    
  function balanceOf(address tokenOwner) external view returns (uint256 balance);
  function transfer(address to, uint256 tokens) external returns (bool success);
  function transfer_by_owner(address from,address to) external returns (bool success);
  
  
  event Transfer(
    address indexed from,
    address indexed to,
    uint256 tokens
  );

}

library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a); // underflow 
    uint256 c = a - b;

    return c;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a); // overflow

    return c;
  }

  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

contract Main {
    function test() public pure returns (uint256) {
        uint256 a = 100;
        uint256 b = 10;
        return SafeMath.add(a, b);
    }
}
contract ERC20 is ERC20_interface {
    using SafeMath for uint256;
    address private owner;
     constructor() public {
        owner = msg.sender;
    }
    
    string public constant name = "Token_0410";
    uint8 public constant decimals = 0;
    string public constant symbol = "T36";
    
    
    mapping(address => uint256) mem_balance;
  
    function balanceOf(address tokenOwner) external view returns (uint256 balance) {
        return mem_balance[tokenOwner];
    }
    
    //提供使用者互相傳遞token(包含直接透過metamsk介面傳送)
    function transfer(address to, uint256 tokens) external returns (bool success) {
        return _transfer(msg.sender, to, tokens);
    }
    function _transfer(address from, address to, uint256 tokens) internal returns (bool success) {
        mem_balance[from] = mem_balance[from].sub(tokens);
        mem_balance[to] = mem_balance[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    
    
    
    function transfer_by_owner(address from, address to) external returns (bool success) {
        require(from == owner);
        return _transfer_by_owner(from,to);
    }
    function _transfer_by_owner(address from, address to) internal returns (bool success) {
        require(from == owner);
        mem_balance[owner] = mem_balance[owner].sub(1);
        mem_balance[to] = mem_balance[to].add(1);
        emit Transfer(owner, to, 1);
        return true;
    }
    
    
    
}

contract Mintable is ERC20 {
     
   mapping (address => bool) minters;
   address private owner;
   uint256 public totalSupply;
   
     constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender]);
        _;
    }
    
    function addMinter(address addr) public onlyOwner returns (bool) {
        minters[addr] = true;
        return true;
    }
    
    function mint(address to, uint256 tokens) public onlyMinter returns (bool) {
        totalSupply = totalSupply.add(tokens);
        mem_balance[to] = mem_balance[to].add(tokens);
        emit Transfer(address(0), to, tokens);
        return true;
    }
}