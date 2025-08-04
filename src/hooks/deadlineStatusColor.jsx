const DeadlineStatusColor = (statusDeadline) => {
        const deadlineStatus = statusDeadline;
        let color = '#3FA2F6';
        if (deadlineStatus === 'soon') {
            color = '#FAFFAF';
        } else if (deadlineStatus === 'failed') {
            color = '#C80036';
        } else if (deadlineStatus === 'progress') {
            color = '#FF7F3E';
        }
        return color;
};

export default DeadlineStatusColor;