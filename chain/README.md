# API Reference 0.1

This reference is divided into three parts: [Core Part](#core-part), [Group Manage Part](#group-manage-part), [Token Part](#token-part). Each is corresponding to a blockchain smart contract.

## Core Part

# Transaction Function
## addOpenTopic
### Description
Add open topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
| stake|uint|The number of token need to stake per user|1000000|
| description|string|Format: title;detail;category;|Hip-hop or Blues which do you like;This vote is just for fun!;Music Genre|
|rate|uint8|0 mean content safe for everyone|0|
|options|string|use to describe the options, divide by `;`|Hip-hop;Blues|
|expirationTime|uint|the unix expired timestamp in seconds|16878999|

### return value
None

### prototype
`addOpenTopic(uint stake, string memory description, uint8 rate, string memory options, uint expirationTime)`

## addGroupTopic
### Description
Add permissioned topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|groupId|uint|the identifier of a certain group, 0 means open to all|98|

The other paramter is the same as [addOpenTopic](#addopentopic).

## vote
### Description
vote a topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|topic_id|uint|the id of topic|22|
|option_idx|uint|the index of voted option, 1 means voting the first option, 2 means voting the second option|2|

## payoff
### Description
Obtain reward token from a topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|topic_id|uint|the id of topic|22|

# Call function
## getTopicCount
### Description
get topic count
### parameters
None
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|topicCount|uint|the count of total topics|1001|

## getTopic
### Description
get detail of topic by id
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|id|uint|topic id|98|
|canVote|bool|if canVote set to true, only show the topic this user can vote, or show all topic|true|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|owner|address|who create this topic|0x1223123132|
|groupId|uint|the permissioned group id of this topic, 0 means open to everyone|2|
|stake|uint|the stake amount in Wei for each person|100000|
| description|string|Format: title;detail;category;|Hip-hop or Blues which do you like;This vote is just for fun!;Music Genre|
|rate|uint8|0 mean content safe for everyone|0|
|options|string|use to describe the options, divide by `;`|Hip-hop;Blues|
|count1|uint|the count of positive vote|9383|
|count2|uint|the count of negative vote|3992|
|lastVoteTime|uint|the last voting time of this topic, init to 0, format in unix timestamp in seconds|1556906283|
|createTIme|uint|the create time of this topic|1556906283|
|expirationTime|uint|the unix expired timestamp in seconds|1556906283|

## getOwnedTopic
### Description
get owned topics;
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|owner|address|query address|0xf1a9184ca7b9|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|lists|uint[]|the list of topic id of queried user|[5, 33, 56, 98]|

## permissionCheck
### Description
check if has permission to vote a special topic, return error code
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|topic_id|uint|the id of topic|22|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|errorCode|uint8|the permission error code, 0: no error, 1: insufficient money, 2: no group permission, 3: duplicate vote, 4: outdated|2|

## isUserVote
### Description
check if user has voted this topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|topic_id|uint|the id of topic|22|
|user|address|query address|0xf1a9184ca7b9|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
||bool|true: user has Voted; false: never voted|true|


## isUserPaid
### Description
Check if user has been rewarded from this topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|topic_id|uint|the id of topic|22|
|user|address|query address|0xf1a9184ca7b9|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
||bool|true: user has been paid; false: user has not been paid|true|

---

## Group Manage Part
# Transaction Function

## createGroup
### Description
Create a permissioned group, the owner of this group is the called address
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|description|string|the description of group|'this group is for our company's internal management'|

## addMember
### Description
Add new member to this group
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|group_id|uint|the queried group id|9|
|member|address|the member address|0xf1a9184ca7b9|

## deleteMember
### Description
Delete a member of this group
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|group_id|uint|the queried group id|9|
|member|address|the member address|0xf1a9184ca7b9|

## changeOwner
### Description
Change the owner of this group to a new one, only old owner can invoke this function
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|group_id|uint|the queried group id|9|
|newOwner|address|the address of new owner|0xf1a9184ca7b9|

# Call function
## isMember
### Description
Check if user has been rewarded from this topic
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|user|address|query address|0xf1a9184ca7b9|
|group_id|uint|the queried group id|9|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
||bool|true: user is in this group; false: user is not in this group|true|

## getOnwedGroups
### Description
Get the owned groups id list of this owner
### parameters
None
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
||uint[]|group id lists of this owner|[3, 9, 23]|

---

## Token Part

# Transaction Function
## transferFrom
### Description
transfer tokens from a to b
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|from|address|transfer out address|0xf1a9184ca7b9|
|to|address|transfer in address|0xf1a9184ca7b9|
|value|uint|the amount of token transfered in Wei|100000|

# Call function
## balanceOf
### Description
Get the token balance of this account
### parameters
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|owner|address|queried address|0xf1a9184ca7b9|
### return value
| name | type| description|example|
| :-------- | :--------| :-- | :-- |
|balance|uint|the token balance of this account in Wei|9900000|



