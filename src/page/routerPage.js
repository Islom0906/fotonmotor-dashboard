import {
    Contact,
    ContactPostEdit,
    NewsPostEdit,
    TgBot,
    TgBotPostEdit,
    News,
    AboutPostEdit,
    About,
    Service,
    ServicePostEdit,
    CarPostEdit,
    Banner,
    BannerPostEdit,
    PositionPostEdit,
    Position,
    Exterior,
    ExteriorPostEdit, InteriorPostEdit, Interior
} from "./index";
import {BiNews} from "react-icons/bi";
import {TiContacts} from "react-icons/ti";
import {RiLockPasswordFill} from "react-icons/ri";
import {IoMdInformationCircle} from "react-icons/io";
import {FaCar, FaImages} from "react-icons/fa";
import Car from "./Car";
import BannerHomePostEdit from "./Banner/BannerHomePostEdit";
import {FaCarOn, FaCarTunnel} from "react-icons/fa6";
import {MdOutlineFormatListBulleted, MdOutlineMiscellaneousServices} from "react-icons/md";


// export const authRole = {
//     admin: 'admin',
//     boss: 'boss',
//     user: 'user'
// }




export const samplePagesConfigs = [
    {
        key:1 ,
        label: 'Car',
        icon: <FaCar className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/car',
        element: Car,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/car/add',
        element: CarPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key:2 ,
        label: 'Position',
        icon: <MdOutlineFormatListBulleted className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/position',
        element: Position,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/position/add',
        element: PositionPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key:3 ,
        label: 'Exterior',
        icon: <FaCarOn className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/exterior',
        element: Exterior,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/exterior/add',
        element: ExteriorPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key:4 ,
        label: 'Interior',
        icon: <FaCarTunnel className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/interior',
        element: Interior,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/interior/add',
        element: InteriorPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    // {
    //     key: 2,
    //     label: 'Категория',
    //     icon: <PiCarSimpleBold className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
    //     path: '/category',
    //     element: Category,
    //     permittedRole: ["admin"],
    //     isBackground: true
    // },
    // {
    //     path: '/category/add',
    //     element: CategoryPostEdit,
    //     permittedRole: ["admin"],
    //     isBackground: true,
    //     noIndex: true
    // },
    {
        key:5 ,
        label: 'Новости',
        icon: <BiNews className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/news',
        element: News,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/news/add',
        element: NewsPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key:6 ,
        label: 'Сервисе',
        icon: <MdOutlineMiscellaneousServices className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/service',
        element: Service,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/service/add',
        element: ServicePostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 7,
        label: 'Баннер',
        icon: <FaImages className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/banner',
        element: Banner,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/banner/add',
        element: BannerPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    // {
    //     key: 5,
    //     label: 'Баннер категория',
    //     icon: <FaImages className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
    //     path: '/banner-category',
    //     element: BannerCategory,
    //     permittedRole: ["admin"],
    //     isBackground: true
    // },
    // {
    //     path: '/banner-category/add',
    //     element: BannerCategoryPostEdit,
    //     permittedRole: ["admin"],
    //     isBackground: true,
    //     noIndex: true
    // },
    // {
    //     key: 6,
    //     label: 'Адрес филиала',
    //     icon: <FaMapMarkerAlt className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
    //     path: '/map',
    //     element: Map,
    //     permittedRole: ["admin"],
    //     isBackground: true
    // },
    // {
    //     path: '/map/add',
    //     element: MapPostEdit,
    //     permittedRole: ["admin"],
    //     isBackground: true,
    //     noIndex: true
    // },
    {
        key: 8,
        label: 'Контакт',
        icon: <TiContacts className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/contact',
        element: Contact,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/contact/add',
        element: ContactPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 9,
        label: 'About',
        icon: <IoMdInformationCircle className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/about',
        element: About,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/about/add',
        element: AboutPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 10,
        label: 'Разрешение Telegram-бота',
        icon: <RiLockPasswordFill className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/tg-bot',
        element: TgBot,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/tg-bot/add',
        element: TgBotPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
];