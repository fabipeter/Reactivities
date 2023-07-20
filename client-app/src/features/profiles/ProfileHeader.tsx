import { observer } from 'mobx-react-lite';
import { Grid, Segment, Item, Header, Statistic, Divider } from "semantic-ui-react";
import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';
import useMediaQuery from '../../app/common/hooks/useMediaQuery';

interface Props {
    profile: Profile
}

export default observer(function ProfileHeader({ profile }: Props) {
    const matches = useMediaQuery("(min-width: 450px)");
    return (
        <Segment>
            <Grid>
                <Grid.Column width={matches?12:9}>
                    <Item.Group>
                        <Item>
                            <Item.Image
                                avatar
                                size={matches?'small':'mini'}
                                src={profile.image || '/assets/user.png'}
                            />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={matches?4:6}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile.followersCount} />
                        <Statistic label='Following' value={profile.followingCount} />
                    </Statistic.Group>
                    <Divider />
                    <FollowButton profile={profile} />
                </Grid.Column>
            </Grid>
        </Segment>

    )
})

