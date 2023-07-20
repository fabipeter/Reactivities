import {Tab, Grid, Header, Card} from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import {useStore} from "../../app/stores/store";
import { observer } from 'mobx-react-lite';
import useMediaQuery from "../../app/common/hooks/useMediaQuery";

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activeTab} = profileStore;
    const minimatches = useMediaQuery("(min-width: 450px)");

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width='16'>
                    <Header
                        floated='left'
                        icon='user'
                        content={activeTab === 3 
                            ? `People following ${profile!.displayName}` 
                            : `People ${profile?.displayName} is following`}
                    />
                </Grid.Column>
                <Grid.Column width='16'>
                    <Card.Group itemsPerRow={!minimatches?"1":'5'}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})
