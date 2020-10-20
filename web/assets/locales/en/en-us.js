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
        viewBlogPage: "View Blog Page"
    },
    pages: {
        layout: {
            profileManagement: "Profile Management",
            postBlog: "Post Blog",
            blogsManagement: "Blogs Management",
            logOut: "Log Out"
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
            saveAsDraft: "Save As Draft",
            publish: "Publish Blog",
            follow: "Follow",
            unFollow: "Unfollow",
            viewProfile: "View author profile",
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
            comments: "comments"
        },
        common: {
            submit: "Submit",
            cancel: "Cancel",
            close: "Close",
            reject: "Reject",
            confirm: "Confirm"
        }
    },
    messages: {
        layout: {
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
                verifyCodeRequired: "Verify Code is required"
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
                contentPlaceHolder: "Input blog content title here...",
                collectionNameRequired: "Collection name is required",
                commentRequired: "Comment shall not be empty"
            },
            general: {
                publishBlogSuccess: "Publish blog success, you can view the blog now.",
                saveBlogSuccess: "Save blog as draft success.",
                discardBlogSuccess: "Discard blog success.",
                discardBlogWarning: "Are you sure to discard the blog?",
                copyLinkSuccess: "Blog link copied to clipboard, you can share the blog elsewhere now."
            },
            errors: {
                ex_no_title: "Title not provided."
            }
        },
        common: {
            unknownError: "Unknown Error.",
            dialogTitleWarning: "Warning!"
        }
    }
}