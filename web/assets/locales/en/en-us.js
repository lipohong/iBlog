export default {
    headers: {
        homePage: "Home Page",
        loginPage: "Login Page",
        registerPage: "Register Page",
        forgetPasswordPage: "Forget Password Page",
        profilePage: "Profile Page",
        createBlogPage: "Create Blog Page",
        editBlogPage: "Edit Blog Page",
        manageBlogPage: "Manage Blog Page",
        viewBlogPage: "View Blog Page",
        authorBlogListPage: "Author Blog List Page",
        authorProfilePage: "Author Profile Page"
    },
    pages: {
        layout: {
            profileManagement: "Profile Management",
            postBlog: "Post Blog",
            blogsManagement: "Blogs Management",
            logOut: "Log Out",
            theme: "Theme",
            lightDarkSwitching: "Light / Dark switch"
        },
        sideBar: {
            backToHome: "Back to home page",
            login: "Go to login page",
            allBlogs: "All Blogs",
            aboutAuthor: "About Author",
            languageSwitching: "English / Chinese switch",
        },
        home: {
            shareWithIBlog: "Share Your Moment With iBlog!",
            description: "iBlog is a blogging website for stories sharing",
            login: "Login",
            postBlog: "Post Blog",
            register: "Register",
            top5BlogsPosters: "Most Blogs Owner",
            top5LatestBlogs: "Latest",
            top5ViewedBlogs: "Most Viewed",
            top5CommentedBlogs: "Most Commented",
            top5LikedBlogs: "Most Liked",
            recommendedBlogs: "Recommended Blogs",
            popularBlogs: "Popular blogs",
            trendingBlogs: "Trending blogs",
            allRecentBlogs: "All Recent Blogs",
            loadMoreBlogs: "Load More Blogs"
        },
        login: {
            iblogLogin: "iBlog Login",
            email: "Email:",
            password: "Password:",
            rememberMe: "Remember Me",
            forgetPassword: "Forget password?",
            submit: "Submit",
            loginViaFacebook: "Login via Facebook",
            createAccount: "Create Account"
        },
        register: {
            iblogRegister: "iBlog Register",
            username: "Username:",
            email: "Email:",
            password: "Password:",
            confirmPassword: "Confirm Password:",
            registerViaFacebook: "Register via Facebook",
            alreadyHaveAccount: "Already have an account?"
        },
        forgetPassword: {
            iblogResetPassword: "iBlog Reset Password",
            email: "Email:",
            verifyCode: "Verify Code:",
            getVerifyCode: "Get Verify Code",
            password: "Password:",
            confirmPassword: "Confirm Password:",
            backToLogin: "Back to login page"
        },
        profile: {
            setupNewPassword: "Set up new password",
            password: "Password:",
            changePassword: "Change password",
            verifyCode: "Verify Code:",
            getVerifyCode: "Get Verify Code",
            username: "Username:",
            description: "Description:",
            updateProfile: "Update Profile",
            logOut: "Log Out",
            uploadImage: "Upload Image",
            updateImage: "Update Image"
        },
        blog: {
            postBlog: "Post Blog",
            categories: {
                categories: "Categories",
                dataStructure: "Data Structure",
                algorithm: "Algorithm",
                designPattern: "Design Pattern",
                programming: "Programming",
                frontend: "Frontend",
                html: "HTML",
                css: "css",
                js: "JavaScript",
                ts: "TypeScript",
                jest: "Jest",
                framework: "Framework",
                UIlibrary: "UI Library",
                backend: "Backend",
                devOps: "Dev Ops",
                networking: "Networking",
                life: "Life",
                other: "Other"
            },
            action: "Action",
            discard: "Discard",
            leave: "Leave",
            cover: "Cover",
            uploadCover: "Upload Cover",
            removeCover: "Remove this cover",
            saveAsDraft: "Save As Draft",
            publish: "Publish Blog",
            follow: "Follow",
            unFollow: "Unfollow",
            viewProfile: "View profile",
            viewBlog: "View this blog",
            editBlog: "Edit this blog",
            like: "Like the blog",
            disLike: "Cancel like the blog",
            collect: "Collect",
            share: "Share this blog",
            collectBlog: "Collect Blog",
            collectionName: "Collection Name",
            addCollection: "Add Collection",
            collectionList: "Collection List",
            noCollection: "No Collection Yet",
            oldCollectionName: "Name",
            collectOrCancel: "Collect / Cancel",
            commentLogin: "Log in",
            leaveComment: "and leave your comment here.",
            likes: "likes",
            comments: "comments",
            blogList: "Blog List",
            title: "Title",
            lastUpdateAt: "Last Update At",
            status: "Stauts",
            viewOrEdit: "View / Edit Blog",
            search: "Search blog",
            noDescriptionMessage: "I am too lazy to write my description here.",
            blogsAmount: "Blogs amount",
            fans: "Fans amount",
            noResult: "No blog result here..."
        },
        user: {
            uploadAvatar: "Upload Avatar",
            removeAvatar: "Remove Avatar",
            email: "Email:",
            username: "Username:",
            description: "Description:"
        },
        common: {
            submit: "Submit",
            cancel: "Cancel",
            close: "Close",
            reject: "Reject",
            confirm: "Confirm",
            published: "Published",
            draft: "Draft"
        }
    },
    messages: {
        layout: {
            languageSwitching: 'English / Chinese switch',
            switchMode: "Switch light/dark Mode Theme",
            chooseMainTheme: "Choose Main Theme",
            switchLanguage: "Switch Language",
            viewSourceCode: "View Source Code",
            action: "Action",
            logIn: "Login In"
        },
        login: {
            form: {
                emailRequired: "Email is required",
                emailNotValid: "Email is not valid",
                passwordRequired: "Password is required"
            },
            general: {
                loginSuccess: "Login Success."
            },
            errors: {
                ex_incorrect_password: "Wrong password.",
                ex_cannot_find_user: "No user record, please create an account first.",
                ex_user_not_exists: "No user record, please create an account first.",
                ex_not_authenticated: "Not authenticated yet. Please try later."
            }
        },
        register: {
            form: {
                usernameRequired: "Username is required",
                emailRequired: "Email is required",
                emailNotValid: "Email is not valid",
                passwordRequired: "Password is required",
                confirmPasswordRequired: "Confirm password is required",
                passwordMissmatch: "Confirm password not match password"
            },
            general: {
                registerSuccess: "Register success, you can activate the account via the link from the email you get.",
                activatingAccount: "Activating account, please wait.",
                activateSuccess: "Account activated, please login with the account."
            },
            errors: {
                ex_no_email: "Email not provided.",
                ex_no_password: "Password not provided.",
                ex_no_username: "Username not provided.",
                ex_user_already_exists: "User already exists, please login.",
                ex_wrong_verifyCode: "Wrong verify code",
                activateFail: "Account activate fail, please try it later."
            }
        },
        forgetPassword: {
            form: {
                usernameRequired: "Username is required",
                emailRequired: "Email is required",
                emailNotValid: "Email is not valid",
                verifyCodeRequired: "Verify Code is required",
                passwordRequired: "Password is required",
                confirmPasswordRequired: "Confirm password is required",
                passwordMissmatch: "Confirm password not match password"
            },
            general: {
                resetPasswordSuccess: "Reset password success, you can login with the new password now.",
                sendVerifyCodeSuccess: "Verify code is sent to your register email, please check it out.",
                sendEmailCountdown: "sec to resend email."
            },
            errors: {
                ex_no_email: "Email not provided.",
                ex_no_password: "Password not provided.",
                ex_no_verifyCode: "Verify code not provided.",
                ex_wrong_verifyCode: "Wrong verify code",
                ex_user_not_exists: "No user record, please create the account first."
            }
        },
        profile: {
            form: {
                usernameRequired: "Username is required",
                passwordRequired: "Password is required",
                verifyCodeRequired: "Verify Code is required",
                descriptionPlaceHolder: "Input your description here...",
            },
            general: {
                resetPasswordSuccess: "Reset password success, you can login with the new password now.",
                sendVerifyCodeSuccess: "Verify code is sent, please check it out.",
                sendEmailCountdown: "sec to resend email.",
                updateProfileSuccess: "Update profile success."
            },
            errors: {
                ex_no_email: "Email not provided.",
                ex_no_password: "Password not provided.",
                ex_no_verifyCode: "Verify code not provided.",
                ex_wrong_verifyCode: "Wrong verify code"
            }
        },
        blog: {
            form: {
                titlePlaceHolder: "Set blog title here...",
                titleRequired: "Title is required",
                coverRequired: "Cover is required",
                contentPlaceHolder: "Input blog content here...",
                collectionNameRequired: "Collection name is required.",
                commentRequired: "Comment should not be empty."
            },
            view: {
                noCommentYet: "No Comment For This Blog Yet",
                commentRequired: "Comment shall not be empty",
                commentPlaceHolder: "Leave your comment here..."
            },
            general: {
                publishBlogSuccess: "Publish blog success, you can view the blog now.",
                saveBlogSuccess: "Save blog as draft success.",
                discardBlogSuccess: "Discard blog success.",
                discardBlogWarning: "Are you sure to discard the blog?",
                unsaveBlogWarning: "Are you sure not to save the blog?",
                copyLinkSuccess: "Blog link copied to clipboard, you can share the blog elsewhere now.",
                followSuccess: "Follow author success.",
                unFollowSuccess: "Unfollow author success.",
                leaveCommentSuccess: "Leave comment success."
            },
            errors: {
                ex_no_title: "Title not provided."
            }
        },
        user: {
            form: {
                usernameRequired: "Username is required"
            },
            general: {
                updateUserProfileSuccess: "Update user profile success",
            }
        },
        common: {
            unknownError: "Unknown Error.",
            dialogTitleWarning: "Warning!"
        }
    }
}