import  {useEffect} from 'react'

const AdminLogout = () => {
    useEffect(() => {
        fetch("/admin_logout", {
            method: "GET",
            headers: {
              Accept: "appllication/json",
              "Content-Type": "application/json"
            },
            credentials: "include"
          }).then((res) => {
            if (res.status === 200) {
                window.location.href = "/Admin/Login";// Redirect to /Admin
              } else {
                throw new Error("Something went wrong!!");
              }
        }).catch(err => console.log(err))
    }, [])

    return null
    
}

export default AdminLogout