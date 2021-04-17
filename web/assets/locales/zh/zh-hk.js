export default {
    headers: {
        homePage: "首頁",
        loginPage: "登錄頁",
        registerPage: "注冊頁",
        forgetPasswordPage: "重置密碼頁",
        profilePage: "個人資料頁",
        createBlogPage: "新建blog頁",
        editBlogPage: "編輯blog頁",
        manageBlogPage: "管理blog頁",
        viewBlogPage: "瀏覽blog頁",
        authorBlogListPage: "作者blog列表頁",
        authorProfilePage: "作者簡介頁"
    },
    pages: {
        layout: {
            profileManagement: "個人資料管理",
            postBlog: "發Blog",
            blogsManagement: "管理Blog",
            logOut: "登出",
            theme: "主題",
            lightDarkSwitching: "日間 / 夜間模式切換"
        },
        sideBar: {
            backToHome: "回首頁",
            login: "去登陸頁",
            allBlogs: "全部 Blog",
            aboutAuthor: "關於作者",
            languageSwitching: "英文 / 中文切換",
        },
        home: {
            shareWithIBlog: "在 iBlog 分享你的時刻!",
            description: "iBlog 是一個分享故事的 blog 網站",
            login: "登錄",
            postBlog: "發 Blog",
            register: "注冊",
            top5BlogsPosters: "最多發 blog 作者",
            top5LatestBlogs: "最新發佈",
            top5ViewedBlogs: "最多瀏覽",
            top5CommentedBlogs: "最多評論",
            top5LikedBlogs: "最多點讚"
        },
        login: {
            iblogLogin: "iBlog 登錄",
            email: "電郵:",
            password: "密碼:",
            rememberMe: "記住信息",
            forgetPassword: "忘記密碼?",
            submit: "提交",
            loginViaFacebook: "通過 Facebook 登錄",
            createAccount: "新建賬戶"
        },
        register: {
            iblogRegister: "iBlog 注冊",
            username: "用戶名:",
            email: "電郵:",
            password: "密碼:",
            confirmPassword: "密碼確認:",
            registerViaFacebook: "通過 Facebook 注冊",
            alreadyHaveAccount: "已有賬號?"
        },
        forgetPassword: {
            iblogResetPassword: "iBlog 重置密碼",
            email: "電郵:",
            verifyCode: "驗證碼:",
            getVerifyCode: "接收驗證碼",
            password: "密碼:",
            confirmPassword: "密碼確認:",
            backToLogin: "回登錄頁"
        },
        profile: {
            setupNewPassword: "設定新密碼",
            password: "密碼:",
            changePassword: "更改密碼",
            verifyCode: "驗證碼:",
            getVerifyCode: "接收驗證碼",
            username: "用戶名:",
            description: "個人描述:",
            updateProfile: "更新個人資料",
            logOut: "登出",
            uploadImage: "上傳照片",
            updateImage: "更新照片"
        },
        blog: {
            postBlog: "發 Blog",
            categories: {
                categories: "分類",
                dataStructure: "資料結構",
                algorithm: "演算法",
                designPattern: "設計模式",
                programming: "程式語言",
                frontend: "前端",
                html: "HTML",
                css: "css",
                js: "JavaScript",
                ts: "TypeScript",
                jest: "Jest",
                framework: "框架",
                UIlibrary: "使用者界面程式庫",
                backend: "後端",
                devOps: "開發維運",
                networking: "網絡",
                life: "程式員生活",
                other: "無分類"
            },
            action: "操作",
            discard: "丟棄",
            leave: "離開",
            cover: "封面",
            uploadCover: "上載封面",
            removeCover: "移除封面",
            saveAsDraft: "保存為草稿",
            publish: "發佈 Blog",
            follow: "關注",
            unFollow: "取消關注",
            viewProfile: "查看資料",
            viewBlog: "瀏覽 blog",
            editBlog: "編輯 blog",
            like: "為 blog 點贊",
            disLike: "取消讚",
            collect: "收藏",
            share: "分享 blog",
            collectBlog: "收藏 Blog",
            collectionName: "收藏夾名稱",
            addCollection: "新增收藏",
            collectionList: "收藏列表",
            noCollection: "尚未有收藏夾",
            oldCollectionName: "名稱",
            collectOrCancel: "收藏 / 取消收藏",
            commentLogin: "登錄",
            leaveComment: "之後方可留下評論",
            likes: "個讚",
            comments: "個評論",
            blogList: "Blog 列表",
            title: "Blog 標題",
            lastUpdateAt: "最後更新時間",
            status: "狀態",
            viewOrEdit: "瀏覽/編輯 Blog",
            search: "搜尋 blog",
            noDescriptionMessage: "我太懶了，不想自我介紹",
            blogsAmount: "Blog 發佈數量",
            fans: "粉絲數量",
            noResult: "沒有符合條件的 blog "
        },
        user: {
            uploadAvatar: "上載頭像",
            removeAvatar: "移除頭像",
            email: "電郵:",
            username: "用戶名:",
            description: "個人簡介:",
        },
        common: {
            submit: "提交",
            cancel: "取消",
            close: "關閉",
            reject: "拒絕",
            confirm: "確認",
            published: "已發佈",
            draft: "草稿"
        }
    },
    messages: {
        layout: {
            languageSwitching: '英文 / 中文切換',
            switchMode: "切換日間/夜間模式",
            chooseMainTheme: "選擇主題",
            switchLanguage: "語言切換",
            viewSourceCode: "瀏覽源碼",
            action: "操作",
            logIn: "登錄"
        },
        login: {
            form: {
                emailRequired: "請填好電郵地址",
                emailNotValid: "電郵地址格式不合法",
                passwordRequired: "請填好密碼"
            },
            general: {
                loginSuccess: "登錄成功"
            },
            errors: {
                ex_incorrect_password: "密碼錯誤，請重試",
                ex_cannot_find_user: "該電郵尚未登記，請先新建賬戶",
                ex_user_not_exists: "該電郵尚未登記，請先新建賬戶",
                ex_not_authenticated: "驗證失敗，請稍候重試"
            }
        },
        register: {
            form: {
                usernameRequired: "請填好用戶名",
                emailRequired: "請填好電郵地址",
                emailNotValid: "電郵地址格式不合法",
                passwordRequired: "請填好密碼",
                confirmPasswordRequired: "請填好確認密碼",
                passwordMissmatch: "確認密碼與密碼不一致"
            },
            general: {
                registerSuccess: "註冊成功，請通過所收到的電郵中的鏈接進行賬戶激活",
                activatingAccount: "正在激活賬戶，請稍等",
                activateSuccess: "賬戶激活成功，請登錄"
            },
            errors: {
                ex_no_email: "請提供電郵",
                ex_no_password: "請提供密碼",
                ex_no_username: "請提供用戶名",
                ex_user_already_exists: "該電郵已注冊，請登錄",
                ex_wrong_verifyCode: "驗證碼錯誤",
                activateFail: "賬戶激活失敗，請稍後重試"
            }
        },
        forgetPassword: {
            form: {
                usernameRequired: "請填好用戶名",
                emailRequired: "請填好電郵地址",
                emailNotValid: "電郵地址格式不合法",
                verifyCodeRequired: "請填好驗證碼",
                passwordRequired: "請填好密碼",
                confirmPasswordRequired: "請填好確認密碼",
                passwordMissmatch: "確認密碼與密碼不一致"
            },
            general: {
                resetPasswordSuccess: "密碼已重置，請登錄",
                sendVerifyCodeSuccess: "驗證碼已發送到注冊郵箱，請檢查電郵",
                sendEmailCountdown: "秒後重發電郵"
            },
            errors: {
                ex_no_email: "請提供電郵.",
                ex_no_password: "請提供密碼",
                ex_no_verifyCode: "請提供驗證碼",
                ex_wrong_verifyCode: "驗證碼錯誤",
                ex_user_not_exists: "該電郵尚未登記，請先新建賬戶"
            }
        },
        profile: {
            form: {
                usernameRequired: "請填好用戶名",
                passwordRequired: "請填好密碼",
                verifyCodeRequired: "請填好驗證碼",
                descriptionPlaceHolder: "在此輸入個人簡介內容...",
            },
            general: {
                resetPasswordSuccess: "密碼已重置",
                sendVerifyCodeSuccess: "驗證碼已發送到注冊郵箱，請檢查電郵",
                sendEmailCountdown: "秒後重發電郵",
                updateProfileSuccess: "個人資料已更新"
            },
            errors: {
                ex_no_email: "請提供電郵.",
                ex_no_password: "請提供密碼",
                ex_no_verifyCode: "請提供驗證碼",
                ex_wrong_verifyCode: "驗證碼錯誤"
            }
        },
        blog: {
            form: {
                titlePlaceHolder: "在此填寫標題...",
                titleRequired: "請填寫標題",
                coverRequired: "請提供封面",
                contentPlaceHolder: "在此輸入blog内容...",
                collectionNameRequired: "請填寫收藏夾名",
                commentRequired: "請先寫下評論内容"
            },
            view: {
                noCommentYet: "該 Blog 尚未有評論",
                commentRequired: "請輸入評論内容",
                commentPlaceHolder: "在此輸入你的評論..."
            },
            general: {
                publishBlogSuccess: "Blog發佈成功，現在所有人可瀏覽blog",
                saveBlogSuccess: "Blog已存儲為草稿",
                discardBlogSuccess: "Blog已丟棄",
                discardBlogWarning: "要丟棄這篇Blog嗎?",
                unsaveBlogWarning: "Blog 尚未存儲，確定離開嗎?",
                copyLinkSuccess: "Blog 地址已經拷貝到剪貼簿，歡迎分享",
                followSuccess: "關注作者成功",
                unFollowSuccess: "取消關注作者成功",
                leaveCommentSuccess: "評論成功"
            },
            errors: {
                ex_no_title: "請提供標題"
            }
        },
        user: {
            form: {
                usernameRequired: "請填好用戶名",
            },
            general: {
                updateUserProfileSuccess: "更新用戶信息成功",
            }
        },
        common: {
            unknownError: "發生未知錯誤",
            dialogTitleWarning: "注意!"
        }
    }
}