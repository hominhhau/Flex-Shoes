import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ProfileForm.module.scss";
import { Api_Profile } from "../../apis/Api_Profile";
import { Api_Auth } from "../../apis/Api_Auth";

const cx = classNames.bind(styles);

const CustomToast = ({ message, type }) => (
  <div className={cx("custom-toast", type)}>
    <span className={cx("toast-icon")}>
      {type === "success" ? "✅" : "❌"}
    </span>
    <span className={cx("toast-message")}>{message}</span>
  </div>
);

const ProfileForm = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "OTHER",
    addressString: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("profileKey");
        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }
        const response = await Api_Profile.getProfile(userId);
     
        console.log('API Response:', response);
        if (
            response.status === 200 &&
            response.data &&
            response.data.status === 'SUCCESS' &&
            response.data.response
        ) {
            const data = response.data.response;
            setPersonalInfo({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                gender: data.gender || 'OTHER',
                addressString: data.address ? data.address.join(', ') : '',
            });
        } else {
            setError('Không thể tải thông tin hồ sơ.');
        }
      } catch (error) {
        console.error("Profile load error:", error);
        setError(error.message || "An error occurred while loading profile information.");
        toast.error(
          <CustomToast
            message={error.message || "Failed to load profile information."}
            type="error"
          />,
          { toastId: "profile-load-error" }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePersonalChange = (event) => {
    const { name, value } = event.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleGenderChange = (event) => {
    setPersonalInfo({ ...personalInfo, gender: event.target.value });
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const validatePersonalInfo = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;
    if (!personalInfo.firstName.trim()) {
      return "Họ không được để trống.";
    }
    if (!personalInfo.lastName.trim()) {
      return "Tên không được để trống.";
    }
    if (!emailRegex.test(personalInfo.email)) {
      return "Email không hợp lệ.";
    }
    if (!phoneRegex.test(personalInfo.phoneNumber)) {
      return "Số điện thoại phải có 10-11 chữ số.";
    }
    return null;
  };

  const handleSavePersonal = async () => {
    if (updateLoading) return;

    const validationError = validatePersonalInfo();
    if (validationError) {
      toast.error(
        <CustomToast message={validationError} type="error" />,
        { toastId: "personal-validation-error" }
      );
      return;
    }

    setUpdateLoading(true);
    try {
      const userId = localStorage.getItem("profileKey");
      if (!userId) {
        toast.error(
          <CustomToast
            message="Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
            type="error"
          />,
          { toastId: "no-user-id" }
        );
        window.location.href = "/login";
        return;
      }
      const dataToSend = {
        firstName: personalInfo.firstName.trim(),
        lastName: personalInfo.lastName.trim(),
        email: personalInfo.email.trim(),
        phoneNumber: personalInfo.phoneNumber.trim(),
        gender: personalInfo.gender,
        address: personalInfo.addressString
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        userID: userId,
      };

      const result = await Api_Profile.updateProfile(userId, dataToSend);
      console.log("Update profile API response:", JSON.stringify(result, null, 2));
      const resultData = result.data || result;

      if (result.status === 200 && resultData?.status?.toUpperCase() === "SUCCESS") {
        localStorage.setItem("profile", JSON.stringify(resultData.response));
        toast.success(
          <CustomToast
            message={resultData.message || "Cập nhật thông tin cá nhân thành công!"}
            type="success"
          />,
          { toastId: "personal-update-success" }
        );
      } else {
        throw new Error(resultData?.message || "Không thể cập nhật thông tin cá nhân.");
      }
    } catch (error) {
      console.error("Error saving personal information:", error);
      toast.error(
        <CustomToast
          message={error.message || "Đã xảy ra lỗi khi cập nhật thông tin cá nhân."}
          type="error"
        />,
        { toastId: "personal-update-error" }
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const validatePassword = () => {
    if (!loginInfo.oldPassword) {
      return "Vui lòng nhập mật khẩu cũ.";
    }
    if (loginInfo.newPassword !== loginInfo.confirmPassword) {
      return "Mật khẩu mới và xác nhận mật khẩu không khớp.";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(loginInfo.newPassword)) {
      return "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }
    return null;
  };

  const handleSaveLogin = async () => {
    if (updateLoading) return;

    const validationError = validatePassword();
    if (validationError) {
      toast.error(
        <CustomToast message={validationError} type="error" />,
        { toastId: "password-validation-error" }
      );
      return;
    }

    setUpdateLoading(true);
    try {
      const userId = localStorage.getItem("customerId");
      if (!userId) {
        toast.error(
          <CustomToast
            message="Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
            type="error"
          />,
          { toastId: "no-customer-id" }
        );
        window.location.href = "/login";
        return;
      }

      const passwordData = {
        oldPassword: loginInfo.oldPassword,
        newPassword: loginInfo.newPassword,
      };

      const result = await Api_Auth.updatePassword(userId, passwordData);
      console.log("Update password API response:", JSON.stringify(result, null, 2));

      // Xử lý phản hồi trực tiếp (không giả định result.data)
      const resultData = result;

      if ( resultData?.status?.toUpperCase() === "SUCCESS") {
        toast.success(
          <CustomToast
            message={resultData.message || "Cập nhật mật khẩu thành công!"}
            type="success"
          />,
          { toastId: "password-update-success" }
        );
        setLoginInfo({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.warn("API response failed validation:", {
          status: result.status,
          data: result.data,
          result: result,
        });
        throw new Error(
          resultData?.message ||
          resultData?.response ||
          "Không thể cập nhật mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ."
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật mật khẩu:", error);
      if (error.response?.status === 401) {
        toast.error(
          <CustomToast
            message="Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            type="error"
          />,
          { toastId: "session-expired" }
        );
        window.location.href = "/login";
      } else if (error.response?.status === 400) {
        const errorData = error.response.data || error.response;
        toast.error(
          <CustomToast
            message={
              errorData?.message ||
              errorData?.response ||
              "Mật khẩu cũ không chính xác. Vui lòng thử lại."
            }
            type="error"
          />,
          { toastId: "invalid-password" }
        );
      } else {
        toast.error(
          <CustomToast
            message={
              error.message || "Đã xảy ra lỗi trong quá trình cập nhật mật khẩu. Vui lòng thử lại sau."
            }
            type="error"
          />,
          { toastId: "password-update-error" }
        );
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className={cx("loading")}>Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className={cx("error")}>{error}</div>;
  }

  return (
    <div className={cx("page-container")}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={cx("content-section")}>
        <h2 className={cx("content-title")}>Chào mừng đến với Flex Shoes!</h2>
        <p className={cx("content-description")}>
          Tại Flex Shoes, chúng tôi mang đến cho bạn điểm đến tuyệt vời cho các loại giày cao cấp.
          Khám phá bộ sưu tập đa dạng của chúng tôi với các thương hiệu nổi tiếng như Nike, Adidas,
          Puma và New Balance. Dù bạn đang tìm kiếm đôi Air Jordan mới nhất, sự thoải mái của
          Adidas Ultraboost hay thiết kế độc đáo từ các thương hiệu mới, chúng tôi đều có thứ phù hợp
          cho mọi tín đồ giày sneaker.
          <br />
          <br />
          Sứ mệnh của chúng tôi không chỉ là cung cấp giày, mà còn là một phong cách sống. Mỗi đôi giày
          được chế tác tỉ mỉ, kết hợp giữa phong cách, sự thoải mái và hiệu suất để nâng tầm diện mạo
          hàng ngày của bạn. Cập nhật hồ sơ của bạn ngay hôm nay để nhận ưu đãi độc quyền, quyền truy cập
          sớm vào các sản phẩm mới và gợi ý cá nhân hóa theo phong cách của bạn. Hãy tham gia cộng đồng
          sneakerhead của chúng tôi và bước vào thế giới thời trang không giới hạn!
        </p>
        <div className={cx("image-container")}>
          <img
            src="https://png.pngtree.com/png-clipart/20231006/original/pngtree-orange-sneakers-lined-icons-vector-png-image_12972401.png"
            alt="Flex Shoes"
            className={cx("image")}
          />
        </div>
      </div>
      <div className={cx("form-section")}>
        <h2 className={cx("title")}>Hồ sơ của tôi</h2>
        <p className={cx("description")}>
          Quản lý thông tin hồ sơ của bạn để bảo mật tài khoản
        </p>

        <div className={cx("tab-container")}>
          <button
            className={cx("tab-button", { active: activeTab === "personal" })}
            onClick={() => handleTabChange("personal")}
          >
            Quản lý thông tin cá nhân
          </button>
          <button
            className={cx("tab-button", { active: activeTab === "login" })}
            onClick={() => handleTabChange("login")}
          >
            Quản lý thông tin đăng nhập
          </button>
        </div>

        {activeTab === "personal" && (
          <div className={cx("form-container")}>
            <h3 className={cx("form-title")}>Thông tin cá nhân</h3>
            <div className={cx("form-group")}>
              <label htmlFor="firstName" className={cx("label")}>
                <strong>Họ</strong>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={cx("input")}
                value={personalInfo.firstName}
                onChange={handlePersonalChange}
                disabled={updateLoading}
              />
            </div>
            <div className={cx("form-group")}>
              <label htmlFor="lastName" className={cx("label")}>
                <strong>Tên</strong>
              </label>
              <input
                type="text"
                name="lastName"
                className={cx("input")}
                value={personalInfo.lastName}
                onChange={handlePersonalChange}
                disabled={updateLoading}
              />
            </div>
            <div className={cx("form-group")}>
              <label htmlFor="email" className={cx("label")}>
                <strong>Email</strong>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={cx("input")}
                value={personalInfo.email}
                onChange={handlePersonalChange}
                disabled={updateLoading}
              />
            </div>
            <div className={cx("form-group")}>
              <label htmlFor="phone" className={cx("label")}>
                <strong>Số điện thoại</strong>
              </label>
              <input
                type="tel"
                id="phone"
                name="phoneNumber"
                className={cx("input")}
                value={personalInfo.phoneNumber}
                onChange={handlePersonalChange}
                disabled={updateLoading}
              />
            </div>
            <div className={cx("form-group")}>
              <label className={cx("label")}>
                <strong>Giới tính</strong>
              </label>
              <div className={cx("radio-group")}>
                <div className={cx("radio-option")}>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="MEN"
                    checked={personalInfo.gender === "MEN"}
                    onChange={handleGenderChange}
                    className={cx("radio")}
                    disabled={updateLoading}
                  />
                  <label htmlFor="male" className={cx("radio-label")}>
                    Nam
                  </label>
                </div>
                <div className={cx("radio-option")}>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="WOMEN"
                    checked={personalInfo.gender === "WOMEN"}
                    onChange={handleGenderChange}
                    className={cx("radio")}
                    disabled={updateLoading}
                  />
                  <label htmlFor="female" className={cx("radio-label")}>
                    Nữ
                  </label>
                </div>
                <div className={cx("radio-option")}>
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    value="OTHER"
                    checked={personalInfo.gender === "OTHER"}
                    onChange={handleGenderChange}
                    className={cx("radio")}
                    disabled={updateLoading}
                  />
                  <label htmlFor="other" className={cx("radio-label")}>
                    Khác
                  </label>
                </div>
              </div>
            </div>
            <div className={cx("form-group")}>
              <label htmlFor="address" className={cx("label")}>
                <strong>Địa chỉ</strong>
              </label>
              <input
                type="text"
                id="address"
                name="addressString"
                className={cx("input")}
                value={personalInfo.addressString}
                onChange={handlePersonalChange}
                disabled={updateLoading}
              />
            </div>
            <div className={cx("button-container")}>
              <button
                onClick={handleSavePersonal}
                className={cx("save-button")}
                disabled={updateLoading}
              >
                {updateLoading ? "Đang lưu..." : "Lưu thông tin cá nhân"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "login" && (
          <div className={cx("form-container")}>
            <h3 className={cx("form-title")}>Cập nhật mật khẩu</h3>
            <form>
              <div className={cx("form-group")}>
                <label htmlFor="oldPassword" className={cx("label")}>
                  <strong>Mật khẩu cũ</strong>
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  className={cx("input")}
                  value={loginInfo.oldPassword}
                  onChange={handleLoginChange}
                  required
                  disabled={updateLoading}
                />
              </div>
              <div className={cx("form-group")}>
                <label htmlFor="newPassword" className={cx("label")}>
                  <strong>Mật khẩu mới</strong>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className={cx("input")}
                  value={loginInfo.newPassword}
                  onChange={handleLoginChange}
                  required
                  disabled={updateLoading}
                />
              </div>
              <div className={cx("form-group")}>
                <label htmlFor="confirmPassword" className={cx("label")}>
                  <strong>Xác nhận mật khẩu mới</strong>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={cx("input")}
                  value={loginInfo.confirmPassword}
                  onChange={handleLoginChange}
                  required
                  disabled={updateLoading}
                />
              </div>
              <div className={cx("button-container")}>
                <button
                  type="button"
                  onClick={handleSaveLogin}
                  className={cx("save-button")}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;