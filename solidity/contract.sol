pragma solidity ^0.4.25;

contract Factory {

    event Challenge (
        address indexed _poster,
        uint256 indexed _category,
        string _description,
        string _result
    );

	// Create new freeroll
	function newChallenge(uint256 _category,
        string _description,
        string _result)
		public {

        emit Challenge(
            msg.sender,
            _category,
            _description,
            _result
        );
	} // End of newChallenge
} // End of Factory contract
