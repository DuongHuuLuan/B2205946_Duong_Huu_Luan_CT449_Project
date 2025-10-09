<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Sách bạn đang mượn</h1>

        <table class="w-full border-collapse border">
            <thead class="bg-gray-100">
                <tr>
                    <th class="border p-2">#</th>
                    <th class="border p-2">Ngày mượn</th>
                    <th class="border p-2">Hạn trả</th>
                    <th class="border p-2">Trạng thái</th>
                    <th class="border p-2">Tổng tiền</th>
                    <th class="border p-2">Sách</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in list" :key="item._id">
                    <td class="border p-2">{{ index + 1 }}</td>
                    <td class="border p-2">{{ formatDate(item.NgayMuon) }}</td>
                    <td class="border p-2">{{ formatDate(item.HanTra) }}</td>
                    <td class="border p-2">{{ item.TrangThai }}</td>
                    <td class="border p-2">{{ formatMoney(item.TongThanhToan) }}</td>
                    <td class="border p-2">
                        <ul>
                            <li v-for="(sach, i) in item.ChiTietMuon" :key="i">
                                {{ sach.MaSach.TenSach }} ({{ sach.MaSach.MaSach }})
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import tdmsService from "@/services/theodoimuonsach.service";

const list = ref([]);

const formatMoney = (n) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        n || 0
    );

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

onMounted(async () => {
    try {
        const res = await tdmsService.getByDocGia();
        list.value = res;
    } catch (err) {
        console.error(err);
    }
});
</script>
