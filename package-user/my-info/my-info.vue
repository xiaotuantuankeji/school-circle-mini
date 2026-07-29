<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">

            <view class="topUserInfoView">
                <view class="userInfoView">
                    <view class="userInfoAvatarView">
                        <image class="userInfoAvatarImg" src="/static/img/logo/default-avatar.png"
                            v-if="showAvatar==''">
                        </image>
                        <image class="userInfoAvatarImg" :src="showAvatar" v-else></image>
                        <image class="avatarImgIcon" :src="`/static/img/my/${showIdentityIconUrl}.png`"
                            v-if="showIdentityIconUrl!=''"></image>
                    </view>
                    <view class="userInfoDetailView">
                        <view class="userInfoNumIdView" v-if="lookStudentId==loginStudentId">
                            ID: {{showNumId}}</view>
                        <view class="userInfoNameAndSexView">
                            <view class="userInfoNameView">{{showNikeName}}</view>
                            <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="showSex=='1'"></image>
                            <image class="userInfoSexImg" src="/static/img/other/woman.png" v-if="showSex=='2'">
                            </image>
                            <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                v-if="showStatus=='2'&&showStudentSort!='3'&&showStudentSort!='4'">
                            </image>
                        </view>
                        <view class="userInfoSchoolAndButtomView">
                            <view class="userInfoSchoolView">{{showSchoolName}}</view>
                        </view>
                        <view class="myIdentityRemarkView" v-if="showIdentityIconText != ''">
                            <image class="myIdentityRemarkImg" src="/static/img/my/white-v.png"></image>
                            <view class="myIdentityRemarkText">{{showIdentityIconText}}</view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="middleSignatureAndHobbyView">
                <view class="middleSignatureImageView">
                    <image class="middleSignatureLeftImg" src="/static/img/other/signature.png"></image>
                    <image class="middleSignatureRightImg" src="/static/img/other/edit-bottom.png"
                        @click="openSignature" v-if="lookStudentId==loginStudentId"></image>
                </view>
                <view class="middleSignatureView">
                    <view class="middleSignatureNotText" v-if="showSignature==''">未填写</view>
                    <text class="middleSignatureText" v-else>{{showSignature}}</text>
                </view>
                <view class="middleHobbyImageView">
                    <image class="middleHobbyImage" src="/static/img/other/hobby.png"></image>
                </view>
                <view class="middleHobbyContentView">
                    <view class="hobbyContentItemsView" v-for="(name, idx) in showHobby" :key="idx"
                        v-if="showHobby.length>0">
                        <view class="hobbyContentItemsText">{{name}}</view>
                    </view>
                    <view class="hobbyContentItemsView addTagPadding" @click="tagClick"
                        v-if="lookStudentId==loginStudentId">
                        <view class="hobbyContentItemsText">+ 新增标签</view>
                    </view>
                </view>
                <view class="middleHobbyImageView" v-if="showBadgeList.length>0">
                    <image class="middleHobbyImage" src="/static/img/my/my_badge.png"></image>
                </view>
                <view class="middleBadgeContentView" v-if="showBadgeList.length>0">
                    <view class="badgeContentItemsView" v-for="(item, idx) in showBadgeList" :key="idx">
                        <uni-tooltip :content="item.badgeSortName" placement="top">
                            <image class="badgeContentItemsImg" :src="item.badgeImagePath"></image>
                        </uni-tooltip>
                    </view>
                </view>
            </view>

            <view class="basicInfoView"
                v-if="lookStudentId==loginStudentId&&showStudentSort!='3'&&showStudentSort!='4'">
                <uni-list>
                    <uni-list-item showArrow title="生日" :rightText="showBirthday" clickable
                        @click="openBirthday"></uni-list-item>
                    <uni-list-item showArrow title="性别" :rightText="showSexName" :clickable="(showSex=='0')?true:false"
                        @click="openSex"></uni-list-item>
                    <span style="margin-left: 40rpx;color: #FF0000;font-size: 24rpx;">*确定性别后不能更改，请慎重选择。</span>
                    <uni-list-item showArrow title="身高(cm)" :rightText="showHeight" clickable
                        @click="openBodyHeight"></uni-list-item>
                    <uni-list-item showArrow title="体重(kg)" :rightText="showWeight" clickable
                        @click="openBodyWeight"></uni-list-item>
                    <uni-list-item showArrow title="家乡" :rightText="showHometown" clickable
                        @click="openHometown"></uni-list-item>
                    <uni-list-item showArrow title="MBTI" :rightText="showMBTI" clickable
                        @click="openMBTI"></uni-list-item>
                </uni-list>
            </view>
            <view class="basicInfoView"
                v-if="lookStudentId!=loginStudentId && loginIsShowInfo=='0'&&showStudentSort!='3'&&showStudentSort!='4'">
                <uni-list>
                    <uni-list-item title="生日" :rightText="showBirthday"></uni-list-item>
                    <uni-list-item title="性别" :rightText="showSexName"></uni-list-item>
                    <uni-list-item title="身高(cm)" :rightText="showHeight"></uni-list-item>
                    <uni-list-item title="体重(kg)" :rightText="showWeight"></uni-list-item>
                    <uni-list-item title="家乡" :rightText="showHometown"></uni-list-item>
                    <uni-list-item title="MBTI" :rightText="showMBTI"></uni-list-item>
                </uni-list>
            </view>

        </view>

        <uni-popup ref="signaturePopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">个性签名</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-easyinput type="textarea" v-model="signature"></uni-easyinput>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveSignature">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="hobbyPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">兴趣爱好</view>
                </view>
                <view class="popupContentView">
                    <view class="popupHobbyTagView">
                        <view class="popupHobbyTagItemView" :class="item.isChecked?'checkedView':''"
                            v-for="(item, idx) in hobbyTag" :key="idx" @click="checkedClick(idx, item.isChecked)">
                            <view class="popupHobbyTagItemText" :class="item.isChecked?'checkedText':''">{{item.name}}
                            </view>
                        </view>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveHobbyTag">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="birthdayPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">生日</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-datetime-picker type="date" :clear-icon="false" v-model="birthday" />
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveBirthday">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="sexPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">性别</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-data-select v-model="sex" :localdata="sexRange" @change="sexChange" placement="top"
                            :clear="false"></uni-data-select>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveSex">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="bodyHeightPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">身高(cm)</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-easyinput type="number" v-model="bodyHeight"></uni-easyinput>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveBodyHeight">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="bodyWeightPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">体重(kg)</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-easyinput type="number" v-model="bodyWeight"></uni-easyinput>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveBodyWeight">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="hometownPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">家乡</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-easyinput type="text" v-model="hometown"></uni-easyinput>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveHometown">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="MBTIPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">MBTI</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <uni-easyinput type="text" v-model="MBTI"></uni-easyinput>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="saveMBTI">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

    </view>
</template>

<script>
    import verifySchool from '../../libs/verify_school'
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginStudentId: '',
                loginSchoolId: '',
                loginSchoolName: '',
                loginNikeName: '',
                loginAvatar: '',
                loginNumId: '',
                loginSex: '0',
                loginSexName: '',
                loginStudentSort: '',
                loginStatus: '',
                myBackground: '',
                loginHobby: [],
                loginSignature: '',
                loginBirthday: '',
                loginHeight: '',
                loginWeight: '',
                loginHometown: '',
                loginMBTI: '',
                loginIsShowInfo: '1',
                loginIsShowNumId: '1',
                loginShowNikeName: '',
                loginIdentityIconUrl: '',
                loginIdentityIconText: '',
                loginBadgeList: [],

                lookStudentId: '',
                lookNikeNameId: '',

                showStudentId: '',
                showBackground: '',
                showNikeName: '',
                showAvatar: '',
                showNumId: '',
                showSex: '0',
                showSchoolName: '',
                showIdentityIconUrl: '',
                showIdentityIconText: '',
                showSignature: '',
                showHobby: [],
                showBadgeList: [],
                showBirthday: '',
                showSexName: '',
                showStatus: '',
                showHeight: '',
                showWeight: '',
                showHometown: '',
                showMBTI: '',
                showStudentSort: '',

                signature: '',
                birthday: '',
                sex: '',
                bodyHeight: '',
                bodyWeight: '',
                hometown: '',
                MBTI: '',

                hobbyTag: [],
                sexRange: [{
                        value: 1,
                        text: "男"
                    },
                    {
                        value: 2,
                        text: "女"
                    },
                    {
                        value: 0,
                        text: "未知"
                    },
                ],
            }
        },
        onLoad(opt) {
            let lookStudentId = opt.lookStudentId
            if (lookStudentId == undefined) {
                lookStudentId = ''
            }
            this.lookStudentId = lookStudentId

            let lookNikeNameId = opt.lookNikeNameId
            if (lookNikeNameId == undefined) {
                lookNikeNameId = ''
            }
            this.lookNikeNameId = lookNikeNameId

            this.getSystemInfo()
            this.initializeData()
        },
        onShow() {
            this.getLoginInfo()
        },
        methods: {
            // 获取设备信息
            getSystemInfo() {
                const that = this
                uni.getSystemInfo({
                    success: function(res) {
                        that.winWidth = res.windowWidth
                        that.winHeight = res.windowHeight
                    }
                });
            },
            // 获取当前登录用户信息
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
                this.loginSchoolId = userInfo.schoolId
                this.loginSchoolName = userInfo.schoolName
                this.loginNikeName = userInfo.nikeName
                this.loginAvatar = userInfo.avatar
                this.loginNumId = userInfo.numId
                this.loginSex = userInfo.sex
                this.loginStatus = userInfo.status
                this.loginStudentSort = userInfo.sort
                this.loginSexName = this.sexRange.find(item => item.value === parseInt(userInfo.sex)).text
                let myBackground = ''
                if (userInfo.backgroundImage == undefined || userInfo.backgroundImage == '') {
                    myBackground = '/static/img/other/my-background.jpg'
                } else {
                    myBackground = userInfo.backgroundImage
                }
                this.myBackground = myBackground
                let loginHobby = []
                if (userInfo.likeLabel != '') {
                    const likeLabel = userInfo.likeLabel
                    loginHobby = likeLabel.split(',')
                }
                this.loginHobby = loginHobby
                this.loginSignature = userInfo.signature
                this.loginBirthday = userInfo.birthday
                this.loginHeight = userInfo.studentHeight
                this.loginWeight = userInfo.studentWeight
                this.loginHometown = userInfo.hometown
                this.loginMBTI = userInfo.mbti

                this.loginIsShowInfo = userInfo.isShowInfo
                this.loginIsShowNumId = userInfo.isShowNumId
                this.loginShowNikeName = userInfo.showNikeName

                const identityInfoRespVOList = userInfo.identityInfoRespVOList
                if (identityInfoRespVOList.length > 0) {
                    if (identityInfoRespVOList[0].examineStatus == '2') {
                        this.loginIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                        this.loginIdentityIconText = identityInfoRespVOList[0].remark
                    }
                } else {
                    this.loginIdentityIconUrl = ''
                    this.loginIdentityIconText = ''
                }

                this.loginBadgeList = userInfo.badgeList

                if (this.lookStudentId == '' || this.loginStudentId == this.lookStudentId) {
                    this.showStudentId = this.loginStudentId
                    this.showNikeName = userInfo.showNikeName
                    this.showAvatar = this.loginAvatar
                    this.showNumId = this.loginNumId
                    this.showSex = this.loginSex
                    this.showStatus = this.loginStatus
                    this.showStudentSort = this.loginStudentSort
                    this.showSchoolName = this.loginSchoolName
                    this.showIdentityIconUrl = this.loginIdentityIconUrl
                    this.showIdentityIconText = this.loginIdentityIconText
                    this.showSignature = this.loginSignature
                    this.showHobby = this.loginHobby
                    this.showBadgeList = this.loginBadgeList
                    this.showBirthday = this.loginBirthday
                    this.showSexName = this.loginSexName
                    this.showHeight = this.loginHeight
                    this.showWeight = this.loginWeight
                    this.showHometown = this.loginHometown
                    this.showMBTI = this.loginMBTI
                } else {
                    this.getStudentInfo()
                }
            },
            getStudentInfo() {
                const param = 'id=' + parseInt(this.lookStudentId) + '&nikeNameId=' + this.lookNikeNameId
                this.$api.getStudentInfo(param).then(res => {
                    // console.log('getStudentInfo succes res:' + JSON.stringify(res))

                    const userData = res.data
                    this.showStudentId = userData.studentId
                    this.showNikeName = userData.showNikeName
                    this.showAvatar = userData.avatar
                    this.showNumId = userData.numId
                    this.showSex = userData.sex
                    this.showStatus = userData.status
                    this.showStudentSort = userData.sort
                    this.showSchoolName = userData.schoolName
                    const identityInfoRespVOList = userData.identityInfoRespVOList
                    if (identityInfoRespVOList.length > 0) {
                        if (identityInfoRespVOList[0].examineStatus == '2') {
                            this.showIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                            this.showIdentityIconText = identityInfoRespVOList[0].remark
                        }
                    }
                    let loginHobby = []
                    if (userData.likeLabel != '') {
                        const likeLabel = userData.likeLabel
                        loginHobby = likeLabel.split(',')
                    }
                    this.showHobby = loginHobby

                    this.showBadgeList = userData.badgeList

                    this.showBirthday = userData.birthday
                    this.showSexName = this.sexRange.find(item => item.value === parseInt(userData.sex)).text
                    this.showHeight = userData.studentHeight
                    this.showWeight = userData.studentWeight
                    this.showHometown = userData.hometown
                    this.showMBTI = userData.mbti
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            initializeData() {
                this.hobbyTag = [{
                        name: '摄影',
                        isChecked: (this.loginHobby.indexOf('摄影') > -1) ? true : false
                    },
                    {
                        name: '桌游',
                        isChecked: (this.loginHobby.indexOf('桌游') > -1) ? true : false
                    },
                    {
                        name: '音乐',
                        isChecked: (this.loginHobby.indexOf('音乐') > -1) ? true : false
                    },
                    {
                        name: '汉服',
                        isChecked: (this.loginHobby.indexOf('汉服') > -1) ? true : false
                    },
                    {
                        name: '二次元',
                        isChecked: (this.loginHobby.indexOf('二次元') > -1) ? true : false
                    },
                    {
                        name: '运动',
                        isChecked: (this.loginHobby.indexOf('运动') > -1) ? true : false
                    },
                    {
                        name: '电影',
                        isChecked: (this.loginHobby.indexOf('电影') > -1) ? true : false
                    },
                    {
                        name: '游戏',
                        isChecked: (this.loginHobby.indexOf('游戏') > -1) ? true : false
                    },
                    {
                        name: '睡觉',
                        isChecked: (this.loginHobby.indexOf('睡觉') > -1) ? true : false
                    },
                    {
                        name: '追剧',
                        isChecked: (this.loginHobby.indexOf('追剧') > -1) ? true : false
                    },
                    {
                        name: '手作',
                        isChecked: (this.loginHobby.indexOf('手作') > -1) ? true : false
                    },
                    {
                        name: '其他',
                        isChecked: (this.loginHobby.indexOf('其他') > -1) ? true : false
                    }
                ]
            },
            async openSignature() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.signature = this.loginSignature
                this.$refs.signaturePopupRef.open('bottom')
            },
            saveSignature() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&signature=' + this.signature
                this.$api.saveMySignature(param).then(res => {
                    // console.log('saveMySignature succes res:' + JSON.stringify(res))

                    this.loginSignature = this.signature
                    this.showSignature = this.signature

                    const userInfo = this.$storage.user.get()
                    userInfo.signature = this.signature
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.signaturePopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async tagClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.initializeData()
                this.$refs.hobbyPopupRef.open('bottom')
            },
            checkedClick(idx, isChecked) {
                let checked = false
                if (isChecked) {
                    checked = false
                } else {
                    checked = true
                }
                this.hobbyTag[idx].isChecked = checked
            },
            saveHobbyTag() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                let likeHobby = ''
                const hobbyTag = this.hobbyTag
                for (let i = 0; i < hobbyTag.length; i++) {
                    const item = hobbyTag[i]
                    if (item.isChecked) {
                        likeHobby = likeHobby + item.name + ','
                    }
                }
                likeHobby = likeHobby.substring(0, likeHobby.lastIndexOf(','))

                const param = 'loginStudentId=' + this.loginStudentId + '&likeHobby=' + likeHobby
                this.$api.saveMyLikeHobby(param).then(res => {
                    // console.log('saveMyLikeHobby succes res:' + JSON.stringify(res))

                    let loginHobby = []
                    if (likeHobby != '') {
                        loginHobby = likeHobby.split(',')
                    }
                    this.loginHobby = loginHobby
                    this.showHobby = loginHobby

                    const userInfo = this.$storage.user.get()
                    userInfo.likeLabel = likeHobby
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.hobbyPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async openBirthday() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.birthday = this.showBirthday
                this.$refs.birthdayPopupRef.open('bottom')
            },
            saveBirthday() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&birthday=' + this.birthday
                this.$api.saveMyBirthday(param).then(res => {
                    // console.log('saveMyBirthday succes res:' + JSON.stringify(res))

                    this.loginBirthday = this.birthday
                    this.showBirthday = this.birthday

                    const userInfo = this.$storage.user.get()
                    userInfo.birthday = this.birthday
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.birthdayPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async openSex() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.sex = parseInt(this.loginSex)
                this.$refs.sexPopupRef.open('bottom')
            },
            sexChange(e) {
                this.sexRange.forEach((item, idx) => {
                    if (item.value == e) {
                        this.sex = item.value
                    }
                })
            },
            saveSex() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&sex=' + this.sex
                this.$api.saveMySex(param).then(res => {
                    // console.log('saveMySex succes res:' + JSON.stringify(res))

                    this.loginSex = this.sex
                    this.loginSexName = this.sexRange.find(item => item.value === parseInt(this.sex)).text
                    this.showSex = this.sex
                    this.showSexName = this.loginSexName

                    const userInfo = this.$storage.user.get()
                    userInfo.sex = this.sex
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.sexPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async openBodyHeight() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.bodyHeight = this.loginHeight
                this.$refs.bodyHeightPopupRef.open('bottom')
            },
            saveBodyHeight() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&bodyHeight=' + this.bodyHeight
                this.$api.saveMyBodyHeight(param).then(res => {
                    // console.log('saveMyBodyHeight succes res:' + JSON.stringify(res))

                    this.loginHeight = this.bodyHeight
                    this.showHeight = this.bodyHeight

                    const userInfo = this.$storage.user.get()
                    userInfo.studentHeight = this.bodyHeight
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.bodyHeightPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async openBodyWeight() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.bodyWeight = this.loginWeight
                this.$refs.bodyWeightPopupRef.open('bottom')
            },
            saveBodyWeight() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&bodyWeight=' + this.bodyWeight
                this.$api.saveMyBodyWeight(param).then(res => {
                    // console.log('saveMyBodyWeight succes res:' + JSON.stringify(res))

                    this.loginWeight = this.bodyWeight
                    this.showWeight = this.bodyWeight

                    const userInfo = this.$storage.user.get()
                    userInfo.studentWeight = this.bodyWeight
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.bodyWeightPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async openHometown() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.hometown = this.loginHometown
                this.$refs.hometownPopupRef.open('bottom')
            },
            saveHometown() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&hometown=' + this.hometown
                this.$api.saveMyHometown(param).then(res => {
                    // console.log('saveMyHometown succes res:' + JSON.stringify(res))

                    this.loginHometown = this.hometown
                    this.showHometown = this.hometown

                    const userInfo = this.$storage.user.get()
                    userInfo.hometown = this.hometown
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.hometownPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async openMBTI() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.MBTI = this.loginMBTI
                this.$refs.MBTIPopupRef.open('bottom')
            },
            saveMBTI() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&mbti=' + this.MBTI
                this.$api.saveMyMBTI(param).then(res => {
                    // console.log('saveMyMBTI succes res:' + JSON.stringify(res))

                    this.loginMBTI = this.MBTI
                    this.showMBTI = this.MBTI

                    const userInfo = this.$storage.user.get()
                    userInfo.mbti = this.MBTI
                    uni.setStorageSync("userInfo", userInfo)

                    this.$refs.MBTIPopupRef.close()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
        }
    }
</script>

<style>
    .content {
        background: linear-gradient(181deg, #2CABA6 0%, #F3F3F1 41%, #F3F3F1 100%);
        position: relative;
    }

    .contentInsideView {
        width: 89%;
        height: 96%;
        position: absolute;
        z-index: 2;
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .topUserInfoView {}

    .userInfoView {
        display: flex;
        flex-direction: row;
        padding: 30rpx 46rpx;
    }

    .userInfoAvatarView {
        width: 146rpx;
        height: 146rpx;
        position: relative;
    }

    .userInfoAvatarImg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .avatarImgIcon {
        width: 50rpx;
        height: 50rpx;
        position: absolute;
        bottom: 0;
        left: 100rpx;
    }

    .userInfoDetailView {
        width: 75%;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .userInfoNumIdView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #d9e6e3;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .userInfoNameAndSexView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .userInfoNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 33rpx;
        color: #F3F3F1;
        line-height: 46rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .userInfoSexImg {
        width: 32rpx;
        height: 32rpx;
        margin-left: 10rpx;
    }

    .userInfoAuthImg {
        width: 77rpx;
        height: 42rpx;
        margin-left: 10rpx;
    }

    .userInfoSchoolAndButtomView {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .userInfoSchoolView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #F3F3F1;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .myIdentityRemarkView {
        margin-top: 5rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .myIdentityRemarkImg {
        width: 24rpx;
        height: 28rpx;
    }

    .myIdentityRemarkText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 24rpx;
        color: #F3F3F1;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .middleSignatureAndHobbyView {
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(0, 0, 0, 0.16);
        border-radius: 19rpx;
        padding: 35rpx 58rpx;
    }

    .middleSignatureImageView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .middleSignatureLeftImg {
        width: 130rpx;
        height: 30rpx;
    }

    .middleSignatureRightImg {
        width: 24rpx;
        height: 24rpx;
    }

    .middleSignatureView {
        margin-top: 20rpx;
    }

    .middleSignatureNotText {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20rpx 0;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-size: 29rpx;
        color: #d6d6d6;
    }

    .middleSignatureText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .middleHobbyImageView {
        margin-top: 20rpx;
    }

    .middleHobbyImage {
        width: 130rpx;
        height: 30rpx;
    }

    .middleHobbyContentView {
        margin-top: 20rpx;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        /* 创建4列，每列宽度相等 */
        gap: 10px;
        /* 可选，设置列行之间的间隙 */
    }

    .hobbyContentItemsView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: #DFFFDF;
        border-radius: 31rpx;
        padding: 10rpx 40rpx;
    }

    .addTagPadding {
        padding: 10rpx;
    }

    .hobbyContentItemsText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #106E6A;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .middleBadgeContentView {
        margin-top: 20rpx;
        display: flex;
        flex-direction: row;
    }

    .badgeContentItemsView {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .badgeContentItemsImg {
        width: 68rpx;
        height: 68rpx;
    }

    .basicInfoView {
        margin-top: 40rpx;
    }

    .uni-list {
        border-radius: 19rpx;
        /* 这里的数值可以根据你的设计需求调整 */
        overflow: hidden;
        /* 确保子元素超出部分不显示 */
    }

    .popupView {
        background: linear-gradient(180deg, #2CABA6 0%, #FFFFFF 20%, #FFFFFF 100%);
        border-radius: 65rpx;
        display: flex;
        flex-direction: column;
        padding: 80rpx 30rpx 20rpx 30rpx;
    }

    .popupTitleView {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .popupTitleText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 33rpx;
        color: #000000;
        line-height: 46rpx;
        font-style: normal;
        text-transform: none;
    }

    .popupContentView {
        margin-top: 40rpx;
    }

    .popupButtonView {
        margin-top: 40rpx;
    }

    .popupButton {
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .popupHobbyTagView {
        padding: 40rpx;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        /* 创建4列，每列宽度相等 */
        gap: 15px;
        /* 可选，设置列行之间的间隙 */
    }

    .popupHobbyTagItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: #F3F3F1;
        border-radius: 31rpx;
        padding: 10rpx 30rpx;
    }

    .popupHobbyTagItemText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #A6A6A6;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .checkedView {
        background: #DFFFDF;
    }

    .checkedText {
        color: #106E6A;
    }

    .popupContentInsideView {
        padding: 40rpx;
    }
</style>