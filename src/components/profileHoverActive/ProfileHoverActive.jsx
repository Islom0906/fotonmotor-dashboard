import { Flex} from "antd";
import {FaRegUserCircle} from "react-icons/fa";
import {VscFileSubmodule} from "react-icons/vsc";

 const ProfileHoverActive = ({ full_name , moduls }) => {
   console.log(full_name)
   console.log(moduls)
  return (
      <Flex vertical={true} gap={5} >
        {
          full_name &&
            <Flex gap={5} align={'center'}>
              <FaRegUserCircle />
              <p>{full_name}</p>
            </Flex>
        }
        {
          moduls &&
            <Flex gap={2} align={'center'}>
              <VscFileSubmodule />
              <p>{moduls}</p>
            </Flex>
        }
      </Flex>
  );
};

 export default ProfileHoverActive
