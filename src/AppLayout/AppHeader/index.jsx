import './index.scss'
import {BellOutlined, MoonOutlined, SunOutlined, UserOutlined} from "@ant-design/icons";
import {Badge, Button, Dropdown, Flex} from "antd";
import {Header} from "antd/es/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeMode} from "../../store/slice/themeSlice";
import {authData} from "../../store/slice/authSlice";
import {Link, useNavigate} from "react-router-dom";



const AppHeader = () => {
    const {systemMode}=useSelector(state => state.theme)
    const {data:{user}}=useSelector(state => state.auth)
    const dispatch=useDispatch()
  const navigate=useNavigate()
    const isDarkHandle=()=>{
        dispatch(changeThemeMode())
    }

  const logOut =() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refToken')
    dispatch(authData({
      user: null,
      isLoading: false,
      isAuthenticated: false
    }))
    navigate('/login')

  }
    return (
        <Header className={'app-header'}>
          <Flex style={{width:'150px'}} align={"center"} justify={"center"}>
              {
                  systemMode === 'light' ?
                      <img src={'/admin/logo.png'} className={'logo'} alt={'logo'}
                           style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                      :
                      <img src={'/admin/logo.png'} className={'logo'} alt={'logo'}
                           style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
              }
          </Flex>
            <div className={'content'}>
                {/*<Badge dot className={'notification'} >*/}
                {/*  <BellOutlined className={'icon'} />*/}
            {/*</Badge>*/}
            {/*  <div onClick={isDarkHandle}>*/}
            {/*      {*/}
            {/*          systemMode==='light'*/}
            {/*              ?*/}
            {/*<MoonOutlined className={'icon'} />:*/}
            {/*              <SunOutlined className={'icon'}/>*/}
            {/*      }*/}
            {/*  </div>*/}
            <UserAccount user={user} logOut={logOut}  />
          </div>
        </Header>
    );
};

export default AppHeader;

export  const  UserAccount = ({ user , logOut})=> {


    const items = [
        // {
        //     key: '1',
        //     label: (
        //         <Link  rel="noopener noreferrer" to="/">
        //             Редактировать
        //         </Link>
        //     ),
        // },
        {
            key: '2',
            label: (
                <div onClick={logOut}>
                    Выход
                </div>
            ),
        },
    ];


  return(
      <Dropdown menu={{ items }} placement="topRight" className={'userDropdown'} arrow>
        <Button>
          {
            user?.image ?
          <img src={user?.image} alt="icon"/>
                :
                <UserOutlined className={'icon'} />
          }
          <span className={'content'}>
            <Flex className={'title'} gap={5}><span>{user.first_name}</span> <span>{user.last_name}</span></Flex>
          </span>

        </Button>
      </Dropdown>
  )
}