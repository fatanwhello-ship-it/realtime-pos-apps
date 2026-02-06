'use client';

import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Link from "next/link";

export default function Failed() {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <Ban className="size-15 text-red-500" />
            <h1 className="text-2x1 font-bold">支払いに失敗しました</h1>
            <Link href="/order">
                <Button className="text-red-400">お取り寄せ</Button>
            </Link>
        </div>
    )
}