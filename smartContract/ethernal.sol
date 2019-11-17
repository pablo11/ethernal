pragma solidity >=0.4.22 <0.6.0;
contract Ethernal {

    struct Message {
        int id;
        string text;
        string timestamp;
    }

    Message[] messages;
    uint constant lengthMax = 280; // Same as Twitter

    /// Post a message
    function postMessage(string memory text) public returns (int) {
        // A message can't be empty nor longer than a tweet -> returns error
        if (bytes(text).length < 1 || bytes(text).length > lengthMax) return -1;

        int newId = int(messages.length);
        string memory newTimestamp = uint2str(now);
        Message memory newMessage = Message({
            id: newId,
            text: text,
            timestamp: newTimestamp
        });
        messages.push(newMessage);
        return newId;
    }

    function getMessageById(uint id) public view returns (string memory) {
        // Check id is within range
        //if (id < 0 || id >= messages.length) return "";

        string memory parseMessage = string(abi.encodePacked(uint2str(id), " ", messages[id].timestamp, " ", messages[id].text));
        return parseMessage;
    }

    /// Return the whole array under a long string
    /// "[id] [text]\n"
    function getHistory() public view returns (string memory) {
        string memory stringBuilder = "";

        for (uint i = 0; i < messages.length; i++) {
            stringBuilder = string(abi.encodePacked(stringBuilder, uint2str(i), " ", messages[i].timestamp, " ", messages[i].text, "\n"));
        }

        return stringBuilder;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
    


    ///
    /* function getHistory() public returns (uint[], string[])
    {
        uint[] memory ids = new uint[](messages.length);
        string[] memory texts = new uint[](indexes.length);

        for (uint i = 0; i < messages.length; i++) {
            Message storage message = messages[i];
            ids[i] = message.id;
            texts[i] = message.text;
        }

        return (ids, texts);
    }*/


}
