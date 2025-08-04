import { Flex, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import './index.scss';
import SubMenu from 'antd/es/menu/SubMenu';
import { Link } from 'react-router-dom';
import { samplePagesConfigs} from "../../page/routerPage";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

const AppSidebar = () => {
  const [userRole ,setUserRole] = useState(['admin'])
  const {data:{user}} = useSelector(state => state.auth)

// useEffect(() => {
//   if(user) {
//   user?.roles?.map(item => (
//       setUserRole([item.name])
//   ))
//   }
// } , [user])

  const isPermitted = (roles) => roles.some(role => userRole.includes(role));

  return (
      <Sider width={300} breakpoint={'lg'}>
        <Menu className={'app-aside'} mode="inline">
          {userRole && samplePagesConfigs
              .filter(menu => isPermitted(menu.permittedRole) && !menu.noIndex)
              .map((menu) => (
                  menu.children ? (
                      <SubMenu
                          key={menu.key}
                          title={<LinkItem icon={menu?.icon} label={menu.label} />}
                      >
                        <Menu.ItemGroup>
                          {menu.children
                              .filter(menuItem => isPermitted(menuItem.permittedRole) && !menuItem.noIndex)
                              .map((menuItem) => (
                                  <Menu.Item key={menuItem.key}>
                                    <Link to={`${menuItem.path}`}>
                                      <LinkItem icon={menuItem?.icon} label={menuItem.label} />
                                    </Link>
                                  </Menu.Item>
                              ))}
                        </Menu.ItemGroup>
                      </SubMenu>
                  ) : (
                      <Menu.Item key={menu.key}>
                        <Link to={`${menu.path}`}>
                          <LinkItem icon={menu?.icon} label={menu.label} />
                        </Link>
                      </Menu.Item>
                  )
              ))}
        </Menu>
      </Sider>
  );
};

export default AppSidebar;

export const LinkItem = ({ icon, label }) => {
  return (
      <Flex gap={20}>
        <span>{icon}</span>
        <span>{label}</span>
      </Flex>
  );
};
