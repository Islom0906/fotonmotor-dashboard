import {Avatar,  Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {ProfileHoverActive} from "../index";

const AvatarUserProfile = ({ full_name , moduls  , image , key}) => {
  console.log(full_name)
  console.log(moduls)
  return (
      <Tooltip
          key={key}
          title={
            <ProfileHoverActive moduls={moduls} full_name={full_name} />
          }
          placement="top"
      >
        <Avatar
            icon={
              image ? (
                  <img
                      src={image}
                      alt={full_name}
                  />
              ) : (
                  <UserOutlined />
              )
            }
        />
      </Tooltip>
  );
};

export default AvatarUserProfile
