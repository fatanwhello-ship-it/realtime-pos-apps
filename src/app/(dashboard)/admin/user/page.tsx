import { title } from "process";
import UserManagement from "./_components/user";


export const metadata = {
  title: ' メイドカフェ | User Management'
}

export default function UserManagementPage() {
  return (
    <UserManagement />
  ); 
}
