<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">

        <view class="contentInsideView">

            <div class="container">
                <h1>团团校园圈社区规范</h1>
                <p class="subtitle">为了维护社区秩序，保持良好氛围，团团校园圈将依据本规范中的条款对使用本平台的用户和发布在本平台上的内容进行管理</p>

                <div class="section">
                    <h2>违规行为的界定</h2>

                    <div class="category">
                        <h3>1 违反法律法规</h3>
                        <ol class="rules-list">
                            <li class="rule-item">反对宪法所确定的基本原则</li>
                            <li class="rule-item">危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一</li>
                            <li class="rule-item">损害国家荣誉和利益</li>
                            <li class="rule-item">煽动民族仇恨、民族歧视，破坏民族团结</li>
                            <li class="rule-item">侮辱、滥用英烈形象，否定英烈事迹，美化粉饰侵略战争行为</li>
                            <li class="rule-item">破坏国家宗教政策，宣扬邪教和封建迷信</li>
                            <li class="rule-item">散布谣言，扰乱社会秩序，破坏社会稳定</li>
                            <li class="rule-item">宣扬淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪</li>
                            <li class="rule-item">煽动非法集会、结社、游行、示威、聚众扰乱社会秩序</li>
                            <li class="rule-item">泄露他人隐私，侵害他人的肖像权、姓名权或其他权益，捏造事实或身份，诽谤他人，产生恶劣影响</li>
                            <li class="rule-item">捏造、攻击、嘲讽、戏谑、传播历任及现任党和国家领导人相关敏感信息</li>
                            <li class="rule-item">出租、出售、求购、传播翻墙相关软件或信息</li>
                            <li class="rule-item">发布含有法律、行政法规禁止的其他内容的信息</li>
                            <li class="rule-item">发布上级监管部门禁止的危害平台安全的信息</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>2 违反校规</h3>
                        <ol class="rules-list">
                            <li class="rule-item">发布出租或求租床位、校园卡、学生证、校内账号等信息</li>
                            <li class="rule-item">发布征集或者提供代跑、代课、代考、代写作业、代签到等作弊信息</li>
                            <li class="rule-item">盗用学校或学校部门、校内组织名义从事活动</li>
                            <li class="rule-item">其他通过校园圈组织、参与、宣扬的违反校规的行为</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>3 违反发帖要求</h3>
                        <ol class="rules-list">
                            <li class="rule-item">发布不符合国家相关法律和社区规定类别的闲置</li>
                            <li class="rule-item">发布寻人类帖子时未说明来意或侵犯他人隐私</li>
                            <li class="rule-item">七天之内以同一账号、不同账号或跟帖等任意形式重复发布帖子(寻物招领类除外)</li>
                            <li class="rule-item">宠物领养只允许无偿领养，禁止商家机构或个人进行宠物销售行为</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>4 不友善的行为</h3>
                        <ol class="rules-list">
                            <li class="rule-item">轻蔑:贬低、轻视他人及其劳动成果</li>
                            <li class="rule-item">诽谤:捏造、散布虚假事实，损害他人名誉</li>
                            <li class="rule-item">嘲讽:以比喻、夸张、侮辱性的文字或图像，戏谑调侃他人，令人产生不适</li>
                            <li class="rule-item">挑衅:以不友好的方式激怒他人，意图使对方对自己的言论作出回应，蓄意制造事端，或者无根据地臆测他人的发言或行事动机，恶意引战</li>
                            <li class="rule-item">羞辱:贬低他人的能力、行为、生理或身份特征，让对方难堪</li>
                            <li class="rule-item">谩骂:以不文明的语言攻击他人或实体</li>
                            <li class="rule-item">歧视:针对他人的民族、种族、宗教、性取向、性别、年龄、地域、生理特征、疾病、专业等身份的攻击</li>
                            <li class="rule-item">威胁:许诺以不良的后果来迫使他人服从自己的意志</li>
                            <li class="rule-item">欺诈:通过编造身份或事实，谋取利益、引发混乱或哗众取宠</li>
                            <li class="rule-item">剧透:在热门作品上映或播出期间，故意剧透</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>5 发布垃圾信息、广告信息</h3>
                        <ol class="rules-list">
                            <li class="rule-item">以商家、机构、微商、代理、代购、中介、黄牛、个体户、兼职、自由职业者等任何商业身份发布牟利或推广信息</li>
                            <li class="rule-item">以所谓出售或出租闲置为名义的牟利行为</li>
                            <li class="rule-item">有组织地以软文发布售卖产品、提供服务、宣传推广等内容的垃圾广告，以及以消费者或用户等身份发布的软文钓鱼帖</li>
                            <li class="rule-item">发布诱导用户点击、分享、点赞、集赞、评论、跳转、关注的引流营销内容</li>
                            <li class="rule-item">发布含有返利内容的推广链接、二维码等内容，返利范围包括金钱、积分、资格等</li>
                            <li class="rule-item">发布非校内相关的活动信息</li>
                            <li class="rule-item">通过快速发帖、回帖、发布无意义图文等行为干扰社区秩序和用户体验</li>
                            <li class="rule-item">频繁回复过早时期的帖文，对他人造成干扰</li>
                            <li class="rule-item">频繁骚扰他人，干扰社区秩序</li>
                            <li class="rule-item">发布诸如投票、助力、加速、砍价、测试、点赞、总结等第三方病毒营销类信息</li>
                            <li class="rule-item">发布、转载或讨论极端动保主义、极端环保主义、极端女权主义、极端素食主义、饭圈等相关经典引战话题</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>6 发布色情低俗信息</h3>
                        <ol class="rules-list">
                            <li class="rule-item">发布、索取、传播漏点图、性行为、性交易等相关色情图文、视频、网址等信息</li>
                            <li class="rule-item">发布约炮或相关性暗示等违规交友内容</li>
                            <li class="rule-item">发布细致描绘性行为或露骨自拍的内容</li>
                            <li class="rule-item">发布血腥、恶俗、恐怖、自残等令人感到不适的低俗内容</li>
                            <li class="rule-item">在匿名模式下交友，索取或暴露联系方式；在匿名下交友，但采取捞人等方式规避匿名留联系方式</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>7 被禁止的违规闲置类别</h3>
                        <ol class="rules-list">
                            <li class="rule-item">枪支弹药、管制刀具、易燃易爆品、毒品</li>
                            <li class="rule-item">招嫖信息、原味衣物、烟草、电子烟</li>
                            <li class="rule-item">发票、假证、假章、假冒商品、盗版内容、宠物、翻墙软件及服务</li>
                            <li class="rule-item">试卷、作业、电子资料</li>
                            <li class="rule-item">宠物</li>
                        </ol>
                    </div>

                    <div class="category">
                        <h3>8 其他被禁止的行为</h3>
                        <ol class="rules-list">
                            <li class="rule-item">注册时上传虚假认证信息、冒用他人身份信息</li>
                            <li class="rule-item">挑衅、侮辱谩骂平台客服或其他管理员，干扰平台管理工作</li>
                        </ol>
                    </div>
                </div>

                <div class="section">
                    <h2>用户违反社区规范后的处理</h2>

                    <div class="penalty-content">
                        <p>视危害大小与违规次数的不同，用户违规后被暂停的用户权限和时长也不同。</p>
                        <p>当用户被一定数量的用户举报，会被临时封禁1天，平台会根据用户行为选择解封或者进行正式的封禁操作。</p>

                        <p>一般除违反发帖要求以外的违规行为，起始封禁时长为7或30天，高度政治敏感和恶劣商业行为360天起。所有同类违规行为累犯时，封禁时长增加一级。</p>

                        <p>封禁时长共5档：1天，7天，30天，360天，永久封禁，依次递增。</p>

                        <h3>封禁等级</h3>
                        <div class="penalty-grid">
                            <div class="penalty-card">
                                <div class="penalty-level level-1">1级封禁</div>
                                <p>禁止发帖、搭子</p>
                            </div>
                            <div class="penalty-card">
                                <div class="penalty-level level-2">2级封禁</div>
                                <p>禁止发帖、搭子、评论</p>
                            </div>
                            <div class="penalty-card">
                                <div class="penalty-level level-3">3级封禁</div>
                                <p>禁止修改头像、昵称、学校，禁止评论、发帖、搭子</p>
                            </div>
                            <div class="penalty-card">
                                <div class="penalty-level level-4">4级封禁</div>
                                <p>无法使用小程序(封号)</p>
                            </div>
                        </div>

                        <p>大部分违规行为后的起始封禁等级集中在2级和3级，政治敏感和色情信息及其他恶性行为的起始封禁等级为4级。</p>
                        <p>当用户被封禁后，会被告知处理原因，并有权利提出申诉，平台客服将通过后台于工作日时进行沟通。</p>
                    </div>
                </div>
            </div>

        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
            }
        },
        onLoad() {
            this.getSystemInfo()
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
        }
    }
</script>

<style>
    .content {
        background-color: #FFFFFF;
    }

    .contentInsideView {
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .container {}

    h1 {
        font-size: 32px;
        color: #000000;
        margin-bottom: 15px;
    }

    .subtitle {
        font-size: 18px;
        color: #4b5563;
        max-width: 700px;
        margin: 0 auto;
    }

    .section {
        margin-bottom: 40px;
    }

    h2 {
        font-size: 24px;
        color: #000000;
        padding-bottom: 10px;
        margin-bottom: 20px;
        border-bottom: 2px solid #dbeafe;
        position: relative;
    }

    h2::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 120px;
        height: 2px;
        background: #1a56db;
    }

    .category {
        margin-bottom: 35px;
    }

    h3 {
        font-size: 20px;
        color: #374151;
        margin-bottom: 15px;
        padding-left: 10px;
    }

    .rules-list {
        list-style: none;
        counter-reset: rule-counter;
    }

    .rule-item {
        margin-bottom: 15px;
        padding-left: 30px;
        position: relative;
    }

    .rule-item::before {
        counter-increment: rule-counter;
        content: counter(rule-counter) ".";
        position: absolute;
        left: 0;
        top: 0;
        color: #000000;
        font-weight: bold;
        font-size: 16px;
    }

    .penalty-content {
        background: #f0f4ff;
        border-radius: 10px;
        padding: 25px;
        margin-top: 30px;
    }

    .penalty-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }

    .penalty-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        border-top: 3px solid #e1e1e1;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    }

    .penalty-level {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
        margin-bottom: 10px;
    }

    .level-1 {
        color: #000000;
    }

    .level-2 {
        color: #000000;
    }

    .level-3 {
        color: #000000;
    }

    .level-4 {
        color: #000000;
    }
</style>