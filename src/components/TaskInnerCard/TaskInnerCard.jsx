import { Card, Flex, Progress,  Typography} from "antd";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {AvatarUserProfile} from "../index";

 const TaskInnerCard = ({created_by ,
                                main_task_responsible_user,
                                main_task_deadline,
                                main_task_created_at,
                                taskPercent,
                                main_deadline_status
                              }) => {
  const {Text} = Typography;

    const deadlineColor= DeadlineStatusColor(main_deadline_status)


  return (
      <Card size={"small"} style={{
        borderColor: `${deadlineColor}`,
        borderTop: '6px',
        borderStyle: 'solid',
        borderTopColor: `${deadlineColor}`
      }} title="Информация о задании">
        <Flex vertical={true} gap={10}>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Ответственный человек:</Text>
            <Flex align={"center"} gap={10}>
              <AvatarUserProfile key={main_task_responsible_user?.id} full_name={main_task_responsible_user?.full_name} image={main_task_responsible_user?.image}/>
            </Flex>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>

            <Text type={'secondary'}> Создатель задач:</Text>
            <Flex align={"center"} gap={10}>
              <AvatarUserProfile key={created_by?.id} full_name={created_by?.full_name}  image={created_by?.image}/>
            </Flex>
          </Flex>
          {/*<Flex align={'center'} justify={'space-between'}>*/}
          {/*  <Text type={'secondary'}> Status:</Text>*/}
          {/*  <Text type={'success'}>Active</Text>*/}
          {/*</Flex>*/}
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Время начала:</Text>
            <Text type={'success'}>{dayjs(main_task_deadline).format('DD.MM.YYYY')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Крайний срок:</Text>
            <Text type={'success'}>{dayjs(main_task_created_at).format('DD.MM.YYYY')}</Text>
          </Flex>

          {
            taskPercent &&
              <Flex align={'center'} justify={'space-between'}>
                <Progress percent={taskPercent}
                          percentPosition={{
                            align: 'center',
                            type: 'inner',
                          }}
                          size={['100%', 12]}
                          strokeColor="red" className={'progress'}/>

              </Flex>
          }

          {/*<Flex align={'left'} gap={2} vertical>*/}
          {/*  <Text type={'secondary'}> Progress:</Text>*/}
          {/*  <p>*/}
          {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae, delectus deserunt error excepturi perspiciatis sapiente suscipit tempora vitae voluptatum.*/}
          {/*  </p>*/}

          {/*</Flex>*/}
        </Flex>

      </Card>
  )

}
export default  TaskInnerCard