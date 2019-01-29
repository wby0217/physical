
export default {
    username: /^[\w-]{6,16}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/,
    fundsPassword: /^\d{6}$/,
    isAmount: isNum=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
    bankCard: /^[0-9]*$/,
}
// 金额不超过2位小数的，正小数，任意整数