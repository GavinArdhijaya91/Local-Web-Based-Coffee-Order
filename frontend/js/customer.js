const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "customer") {
  window.location.href = "../login.html";
}