import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { slugify } from '../lib/slugify';

const prisma = new PrismaClient();

// Cloudinary helper — f_auto,q_auto delivers WebP/AVIF + auto quality
const cld = (id: string) => `https://res.cloudinary.com/dauktf8a5/image/upload/f_auto,q_auto/${id}`;

const CLD = {
  // Wikimedia CC — exterior & grounds
  matTien: cld('den-tho-bac/mat-tien'), // mặt tiền chính
  gocKhac: cld('den-tho-bac/goc-khac'), // góc chụp khác
  toanCanh: cld('den-tho-bac/toan-canh'), // toàn cảnh khu đền
  aoCa: cld('den-tho-bac/ao-ca'), // ao cá trong khu di tích
  khuonVien: cld('den-tho-bac/khuon-vien'), // khuôn viên cây xanh
  mayBaySung: cld('den-tho-bac/may-bay-sung'), // máy bay và súng

  // Baocantho — interior & events
  dienTho: cld('den-tho-bac/dien-tho-ben-trong'), // bên trong điện thờ (bàn thờ, lư hương)
  dienThoNghiem: cld('den-tho-bac/dien-tho-trang-nghiem'), // điện thờ trang nghiêm
  nhaTrungBay: cld('den-tho-bac/nha-trung-bay'), // nhà trưng bày
  khuTrungBayAnh: cld('den-tho-bac/khu-trung-bay-anh'), // khu trưng bày ảnh tư liệu
  dangHuong: cld('den-tho-bac/dang-huong'), // dâng hoa dâng hương
  cuuChienBinh: cld('den-tho-bac/cuu-chien-binh'), // cựu chiến binh viếng thăm
  moHinh1971: cld('den-tho-bac/mo-hinh-1971'), // mô hình đền 1971
  taiTao1972: cld('den-tho-bac/tai-tao-1972'), // tái tạo lần 2 (1972)

  // Thamhiemmekong — grounds photos
  khuonVien2: cld('den-tho-bac/khuon-vien-2'),
  khuonVien3: cld('den-tho-bac/khuon-vien-3'),

  // Artifact-specific — altar items, furnishings, stilt house
  luHuongDong: cld('den-tho-bac/lu-huong-dong'), // lư hương đồng close-up
  luHuongDenTho: cld('den-tho-bac/lu-huong-den-tho'), // lư hương tại điện thờ
  binhHoaSu: cld('den-tho-bac/binh-hoa-su'), // lọ hoa sứ bàn thờ
  banThoNoiThat: cld('den-tho-bac/ban-tho-noi-that'), // bàn thờ gỗ khảm xà cừ
  khamXaCu: cld('den-tho-bac/kham-xa-cu'), // khảm xà cừ close-up
  binhPhongKham: cld('den-tho-bac/binh-phong-kham'), // bình phong sơn mài
  chanDenDong: cld('den-tho-bac/chan-den-dong'), // chân đèn đồng
  nhaSanNoiThat: cld('den-tho-bac/nha-san-noi-that'), // nhà sàn nội thất
  nhaSanNgoaiThat: cld('den-tho-bac/nha-san-ngoai-that'), // nhà sàn ngoại thất
};

async function seedAdmin() {
  const email = 'admin@den-tho-bac.local';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, hashedPassword, role: 'ADMIN' },
  });
  console.log(`Seeded admin user: ${email} (password: ${password})`);
}

async function seedFeatures() {
  await prisma.tourGroup.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.artifactOnExhibition.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.post.deleteMany();
  await prisma.exhibition.deleteMany();
  await prisma.room.deleteMany();

  // ── Rooms ──────────────────────────────────────────────────────────────────
  const [roomDienTho, roomNhaTrungBay, roomNhaSan, roomQuanSu, roomKhuonVien] = await Promise.all([
    prisma.room.create({
      data: {
        name: 'Điện thờ (Đền chính)',
        description:
          'Cấu trúc 4×4 m, mái hình hoa sen màu hồng — nơi thờ phụng chính với các hiện vật lễ tế và tranh chân dung Chủ tịch Hồ Chí Minh.',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Nhà trưng bày',
        description:
          'Trưng bày hơn 200 hiện vật, hình ảnh và tài liệu về thân thế, sự nghiệp Bác Hồ và lịch sử ba lần xây dựng, bảo vệ ngôi đền trong kháng chiến.',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Nhà sàn (mô hình)',
        description:
          'Phiên bản tỷ lệ 97% so với nguyên bản tại Hà Nội, xây năm 2012 — trưng bày đồ dùng cá nhân và không gian sống giản dị của Chủ tịch Hồ Chí Minh.',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Khu trưng bày quân sự',
        description:
          'Không gian ngoài trời trưng bày máy bay trực thăng, xe tăng, pháo và súng thu được từ chiến trường — minh chứng cho sức mạnh quân sự trong kháng chiến chống Mỹ.',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Ao cá & Khuôn viên',
        description:
          'Khuôn viên rộng 5,4 ha với ao cá, vườn cây xanh, khu vui chơi và cắm trại — phù hợp cho các đoàn học sinh, sinh viên tham quan và sinh hoạt ngoại khóa.',
      },
    }),
  ]);

  // ── Artifacts ──────────────────────────────────────────────────────────────
  const artifacts = await Promise.all([
    // 1. Lư hương đồng (featured)
    prisma.artifact.create({
      data: {
        name: 'Lư hương đồng',
        description:
          'Bộ lư hương và bình hương bằng đồng đặt trang nghiêm trên bàn thờ chính điện, được đúc thủ công với hoa văn cách điệu hoa sen — biểu tượng thanh tịnh và lòng kính ngưỡng. Bình hương dùng để cắm hương que trong các lễ dâng hương, còn lư hương đốt trầm liên tục, tạo không khí trang nghiêm cho điện thờ. Cả bộ được chế tác tinh xảo với các đường nét chạm khắc hoa văn truyền thống.',
        category: 'Đồ thờ',
        images: [CLD.luHuongDong, CLD.luHuongDenTho],
        featured: true,
        roomId: roomDienTho.id,
      },
    }),
    // 2. Lọ hoa sứ
    prisma.artifact.create({
      data: {
        name: 'Lọ hoa sứ bàn thờ',
        description:
          'Đôi lọ hoa sứ men trắng đặt hai bên bàn thờ, thường được cắm hoa tươi dâng kính Bác Hồ nhân các dịp lễ trọng. Dáng bình cao thanh mảnh, thân trang trí hoa văn cổ điển màu lam, là hiện vật trang thờ tiêu biểu của các đền thờ Nam Bộ.',
        category: 'Đồ thờ',
        images: [CLD.binhHoaSu],
        featured: false,
        roomId: roomDienTho.id,
      },
    }),
    // 3. Tranh sơn dầu (featured)
    prisma.artifact.create({
      data: {
        name: 'Tranh sơn dầu chân dung Bác Hồ',
        description:
          'Bức tranh sơn dầu khổ lớn đặt tại vị trí trung tâm điện thờ, thể hiện chân dung Chủ tịch Hồ Chí Minh trong bộ quần áo ka-ki giản dị. Đây là tác phẩm hội họa có giá trị nghệ thuật cao, được trao tặng bởi các họa sĩ Nam Bộ sau ngày đất nước thống nhất.',
        category: 'Tác phẩm nghệ thuật',
        images: [CLD.dienThoNghiem],
        featured: true,
        roomId: roomDienTho.id,
      },
    }),
    // 4. Bàn thờ gỗ
    prisma.artifact.create({
      data: {
        name: 'Bàn thờ gỗ khảm xà cừ',
        description:
          'Hai bàn thờ gỗ quý chạm khảm xà cừ với hoa văn tứ linh (long, lân, quy, phụng) và hoa văn truyền thống Nam Bộ. Được chế tác bởi các nghệ nhân tỉnh Trà Vinh, trao tặng khu di tích vào năm 1989 sau khi được công nhận di tích quốc gia.',
        category: 'Đồ nội thất',
        images: [CLD.banThoNoiThat],
        featured: false,
        roomId: roomDienTho.id,
      },
    }),
    // 5. Tủ hương gỗ
    prisma.artifact.create({
      data: {
        name: 'Tủ hương gỗ khảm xà cừ',
        description:
          'Tủ hương gỗ khảm xà cừ một cánh, dùng để bảo quản hương liệu và đồ thờ cúng. Chất liệu gỗ gụ tự nhiên, mặt ngoài được khảm xà cừ theo họa tiết hoa lá cách điệu.',
        category: 'Đồ nội thất',
        images: [CLD.khamXaCu],
        featured: false,
        roomId: roomDienTho.id,
      },
    }),
    // 6. Bình phong
    prisma.artifact.create({
      data: {
        name: 'Bộ bình phong',
        description:
          'Năm tấm bình phong sơn mài trang trí hai bên và phía sau bàn thờ chính điện, thể hiện phong cảnh thiên nhiên Nam Bộ: sông nước, vườn dừa, cánh đồng lúa. Đây là những tác phẩm nghệ thuật thủ công truyền thống do nhân dân Long Đức tặng khu di tích.',
        category: 'Đồ thờ',
        images: [CLD.binhPhongKham],
        featured: false,
        roomId: roomDienTho.id,
      },
    }),
    // 7. Chân đèn đồng
    prisma.artifact.create({
      data: {
        name: 'Chân đèn đồng',
        description:
          'Đôi chân đèn bằng đồng đặt hai bên bàn thờ để thắp nến trong các nghi lễ dâng hương. Được đúc thủ công theo truyền thống nghề đồng Việt Nam, thân chân đèn có hoa văn hình trụ cách điệu, bệ đứng vững chắc — biểu tượng ánh sáng soi đường và sự trường tồn của tinh thần.',
        category: 'Đồ thờ',
        images: [CLD.chanDenDong],
        featured: false,
        roomId: roomDienTho.id,
      },
    }),
    // 8. Bộ ấm trà (featured)
    prisma.artifact.create({
      data: {
        name: 'Bộ ấm trà gốm Chủ tịch Hồ Chí Minh',
        description:
          'Bộ ấm trà gốm sứ truyền thống — phiên bản tái hiện bộ ấm trà Bác Hồ thường dùng khi làm việc tại Hà Nội, trưng bày trong nhà sàn mô hình. Ấm có nắp dạng bầu tròn, 4 chén nhỏ, màu men ngà sữa với đường viền hoa xanh coban.',
        category: 'Đồ dùng cá nhân',
        images: [CLD.nhaSanNoiThat, CLD.nhaSanNgoaiThat],
        featured: true,
        roomId: roomNhaSan.id,
      },
    }),
    // 9. Máy bay (featured)
    prisma.artifact.create({
      data: {
        name: 'Máy bay trực thăng (bị bắn hạ)',
        description:
          'Xác máy bay trực thăng quân sự Mỹ bị bắn hạ trong chiến tranh, trưng bày ngoài trời tại khu di tích. Đây là bằng chứng cụ thể về sức mạnh quân sự của quân và dân miền Nam trong kháng chiến chống Mỹ cứu nước. Chiếc trực thăng này bị lực lượng vũ trang tỉnh Trà Vinh bắn hạ vào những năm 1970.',
        category: 'Vũ khí chiến tranh',
        images: [CLD.mayBaySung],
        featured: true,
        roomId: roomQuanSu.id,
      },
    }),
    // 10. Pháo và súng
    prisma.artifact.create({
      data: {
        name: 'Bộ sưu tập pháo và súng quân sự',
        description:
          'Bộ sưu tập vũ khí thu được từ chiến trường, bao gồm pháo hạng nặng, súng máy và các loại vũ khí hạng nhẹ. Tất cả đều là chiến lợi phẩm của quân dân tỉnh Trà Vinh sau các trận đánh lịch sử. Được bảo quản và trưng bày ngoài trời trong khu vực di tích.',
        category: 'Vũ khí chiến tranh',
        images: [CLD.mayBaySung],
        featured: false,
        roomId: roomQuanSu.id,
      },
    }),
    // 11. Tài liệu lịch sử
    prisma.artifact.create({
      data: {
        name: 'Bộ sưu tập hình ảnh và tài liệu lịch sử',
        description:
          'Hơn 200 ảnh tư liệu, bản đồ, văn bản lịch sử về hành trình hoạt động cách mạng của Chủ tịch Hồ Chí Minh từ thuở thiếu thời đến khi lãnh đạo cuộc kháng chiến giành độc lập dân tộc. Đây là tài sản quý giá được sưu tầm từ nhiều nguồn tư liệu trong và ngoài nước.',
        category: 'Tài liệu',
        images: [CLD.khuTrungBayAnh, CLD.nhaTrungBay],
        featured: false,
        roomId: roomNhaTrungBay.id,
      },
    }),
    // 12. Ao cá Bác Hồ
    prisma.artifact.create({
      data: {
        name: 'Ao cá Bác Hồ',
        description:
          'Ao cá rộng hơn 500 m², được thiết kế theo mô hình ao cá tại Phủ Chủ tịch Hà Nội — nơi Bác Hồ thường ra cho cá ăn. Ao cá là điểm tham quan yêu thích của du khách, đặc biệt các đoàn thiếu nhi. Xung quanh ao trồng nhiều loại cây xanh tạo bóng mát.',
        category: 'Tài liệu',
        images: [CLD.aoCa, CLD.khuonVien],
        featured: false,
        roomId: roomKhuonVien.id,
      },
    }),
  ]);

  // ── Exhibitions ────────────────────────────────────────────────────────────
  const [exPermanent, ex56Nam, exBacTon, exDang] = await Promise.all([
    // 1. Permanent — ongoing
    prisma.exhibition.create({
      data: {
        title: 'Thân thế và sự nghiệp Chủ tịch Hồ Chí Minh',
        description:
          'Triển lãm thường trực tại Nhà trưng bày — hơn 200 hiện vật, hình ảnh và tài liệu về cuộc đời hoạt động cách mạng của Bác Hồ từ thuở nhỏ đến khi lãnh đạo cuộc kháng chiến giành độc lập, thống nhất đất nước.',
        startDate: new Date('2026-12-01'),
        endDate: new Date('2027-03-31'),
        coverImage: CLD.dienThoNghiem,
      },
    }),
    // 2. 56 năm — current in 2026
    prisma.exhibition.create({
      data: {
        title: 'Kỷ niệm 56 năm xây dựng và bảo vệ Đền thờ (1970–2026)',
        description:
          'Nhân kỷ niệm 56 năm ngày khởi công xây dựng (10/3/1970), triển lãm tái hiện hành trình ba lần dựng đền giữa bom đạn và những tấm gương anh dũng của nhân dân Long Đức. Trưng bày hình ảnh, sa bàn tái tạo và tài liệu quý hiếm về quá trình xây dựng, bảo vệ ngôi đền.',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-09-30'),
        coverImage: CLD.moHinh1971,
      },
    }),
    // 3. Bác Hồ - Bác Tôn — past 2025
    prisma.exhibition.create({
      data: {
        title: 'Bác Hồ - Bác Tôn, hai con người một chí hướng',
        description:
          'Triển lãm chuyên đề tổ chức hàng năm trước dịp sinh nhật Bác (19/5), khắc họa mối quan hệ đặc biệt giữa Chủ tịch Hồ Chí Minh và Chủ tịch Tôn Đức Thắng — hai người lãnh đạo cùng chí hướng, cùng chiến đấu vì độc lập dân tộc và hạnh phúc của nhân dân.',
        startDate: new Date('2025-05-17'),
        endDate: new Date('2025-05-31'),
        coverImage: CLD.khuTrungBayAnh,
      },
    }),
    // 4. Đảng CSVN — past early 2025
    prisma.exhibition.create({
      data: {
        title: 'Đảng Cộng sản Việt Nam — Một chặng đường vẻ vang',
        description:
          'Triển lãm nhân dịp kỷ niệm 95 năm thành lập Đảng Cộng sản Việt Nam (3/2/1930 – 3/2/2025); khai mạc kèm theo lễ ra mắt Phòng đọc sách Bác Hồ tại khu di tích. Trưng bày hơn 150 tài liệu, hình ảnh về lịch sử hình thành và những chặng đường vẻ vang của Đảng.',
        startDate: new Date('2025-01-24'),
        endDate: new Date('2025-02-28'),
        coverImage: CLD.nhaTrungBay,
      },
    }),
  ]);

  // ── Artifact ↔ Exhibition links ────────────────────────────────────────────
  // indices after removing Bình hương: [0]Lư hương [1]Lọ hoa sứ [2]Tranh [3]Bàn thờ [4]Tủ hương [5]Bình phong [6]Chân đèn [7]Bộ ấm trà [8]Máy bay [9]Pháo [10]Tài liệu [11]Ao cá
  const [a1, a2, a3, a4, , , a7, , a9, , a11] = artifacts;
  await prisma.artifactOnExhibition.createMany({
    data: [
      // Permanent exhibition: altar items + artwork + documents
      { artifactId: a1.id, exhibitionId: exPermanent.id }, // Lư hương đồng
      { artifactId: a3.id, exhibitionId: exPermanent.id }, // Tranh sơn dầu
      { artifactId: a4.id, exhibitionId: exPermanent.id }, // Bàn thờ gỗ
      { artifactId: a11.id, exhibitionId: exPermanent.id }, // Tài liệu lịch sử
      // 56 năm: historical models + documents
      { artifactId: a11.id, exhibitionId: ex56Nam.id }, // Tài liệu lịch sử
      { artifactId: a9.id, exhibitionId: ex56Nam.id }, // Máy bay
      // Bác Hồ - Bác Tôn: decorative items
      { artifactId: a2.id, exhibitionId: exBacTon.id }, // Lọ hoa sứ
      { artifactId: a7.id, exhibitionId: exBacTon.id }, // Chân đèn đồng
      // Đảng CSVN: altar items
      { artifactId: a1.id, exhibitionId: exDang.id }, // Lư hương đồng
    ],
  });

  // ── Posts ──────────────────────────────────────────────────────────────────
  const posts = [
    {
      title: 'Chủ tịch nước Tô Lâm dâng hương tại Đền thờ Bác Hồ ở Trà Vinh',
      category: 'Sự kiện',
      coverImage: CLD.cuuChienBinh,
      publishedAt: new Date('2024-07-06'),
      excerpt:
        'Ngày 6/7/2024, Chủ tịch nước Tô Lâm đã đến dâng hương tưởng niệm Chủ tịch Hồ Chí Minh tại Khu di tích lịch sử, văn hóa cấp quốc gia Đền thờ Bác Hồ ở Long Đức, TP Trà Vinh.',
      content: `<p>Ngày 6/7/2024, Chủ tịch nước Tô Lâm đã đến dâng hương tưởng niệm Chủ tịch Hồ Chí Minh tại Khu di tích lịch sử, văn hóa cấp quốc gia Đền thờ Chủ tịch Hồ Chí Minh tại phường Long Đức, TP Trà Vinh.</p><p>Đây là chuyến thăm mang ý nghĩa sâu sắc, thể hiện sự trân trọng và ghi nhớ công ơn của Chủ tịch Hồ Chí Minh đối với sự nghiệp giải phóng dân tộc và xây dựng đất nước. Cùng tham dự có lãnh đạo tỉnh Trà Vinh và đông đảo nhân dân địa phương.</p><p>Tại điện thờ, Chủ tịch nước cùng đoàn đại biểu đã thực hiện nghi lễ dâng hoa, dâng hương trang nghiêm, tưởng nhớ công đức to lớn của Người đối với dân tộc Việt Nam. Đây cũng là dịp để nhắc nhở thế hệ trẻ về truyền thống uống nước nhớ nguồn của dân tộc.</p>`,
    },
    {
      title: 'Khai mạc triển lãm "Bác Hồ - Bác Tôn, hai con người một chí hướng"',
      category: 'Triển lãm',
      coverImage: CLD.khuTrungBayAnh,
      publishedAt: new Date('2025-05-17'),
      excerpt:
        'Triển lãm chuyên đề kỷ niệm ngày sinh nhật Bác (19/5) được tổ chức tại khu di tích, khắc họa mối quan hệ đặc biệt giữa Chủ tịch Hồ Chí Minh và Chủ tịch Tôn Đức Thắng.',
      content: `<p>Sáng ngày 17/5/2025, Ban Quản lý Khu di tích lịch sử Đền thờ Chủ tịch Hồ Chí Minh tại Long Đức phối hợp với Sở Văn hóa, Thể thao và Du lịch tỉnh Trà Vinh tổ chức lễ khai mạc triển lãm chuyên đề <em>"Bác Hồ - Bác Tôn, hai con người một chí hướng"</em>.</p><p>Triển lãm giới thiệu hơn 100 hình ảnh và tài liệu quý hiếm về cuộc đời, sự nghiệp cách mạng và mối quan hệ gắn bó giữa hai vị lãnh đạo xuất sắc của dân tộc Việt Nam — Chủ tịch Hồ Chí Minh và Chủ tịch Tôn Đức Thắng — những người đã cùng nhau chiến đấu, cống hiến cả cuộc đời cho sự nghiệp giải phóng dân tộc.</p><p>Triển lãm mở cửa từ ngày 17 đến 31/5/2025, miễn phí cho mọi du khách.</p>`,
    },
    {
      title: 'Khai mạc trưng bày "Đảng Cộng sản Việt Nam — Một chặng đường vẻ vang"',
      category: 'Triển lãm',
      coverImage: CLD.nhaTrungBay,
      publishedAt: null,
      excerpt:
        'Nhân kỷ niệm 95 năm thành lập Đảng, khu di tích tổ chức triển lãm chuyên đề kết hợp với lễ ra mắt Phòng đọc sách Bác Hồ.',
      content: `<p>Nhân dịp kỷ niệm 95 năm thành lập Đảng Cộng sản Việt Nam (3/2/1930 – 3/2/2025), ngày 24/1/2025, Khu di tích lịch sử Đền thờ Chủ tịch Hồ Chí Minh tại Long Đức đã tổ chức khai mạc triển lãm chuyên đề <em>"Đảng Cộng sản Việt Nam — Một chặng đường vẻ vang"</em>.</p><p>Triển lãm trưng bày hơn 150 tài liệu, hình ảnh, hiện vật phản ánh lịch sử hình thành và những dấu mốc quan trọng trên chặng đường 95 năm của Đảng Cộng sản Việt Nam từ khi thành lập đến nay.</p><p>Đặc biệt, cùng dịp này, khu di tích chính thức ra mắt <strong>Phòng đọc sách Bác Hồ</strong> — không gian phục vụ nhu cầu đọc sách, tìm hiểu tư liệu lịch sử của nhân dân và du khách.</p>`,
    },
    {
      title: 'Ra mắt Phòng đọc sách Bác Hồ tại khu di tích Long Đức',
      category: 'Tin tức',
      coverImage: CLD.nhaTrungBay,
      publishedAt: new Date('2025-01-24'),
      excerpt:
        'Phòng đọc sách Bác Hồ chính thức ra mắt tại khu di tích, phục vụ nhu cầu tìm hiểu tư liệu lịch sử của nhân dân và du khách.',
      content: `<p>Ngày 24/1/2025, Khu di tích lịch sử Đền thờ Chủ tịch Hồ Chí Minh tại Long Đức chính thức ra mắt <strong>Phòng đọc sách Bác Hồ</strong> — không gian trưng bày và phục vụ đọc sách, tài liệu về thân thế, sự nghiệp của Chủ tịch Hồ Chí Minh.</p><p>Phòng đọc sách được bố trí tại Nhà trưng bày với diện tích gần 60 m², lưu giữ hàng trăm đầu sách, tài liệu, tạp chí nghiên cứu về Chủ tịch Hồ Chí Minh bằng nhiều thứ tiếng. Du khách có thể đến đọc sách, nghiên cứu tài liệu miễn phí trong giờ mở cửa của khu di tích.</p><p>Đây là hoạt động thiết thực nhằm phát huy giá trị di tích, phục vụ công tác giáo dục truyền thống yêu nước và học tập tư tưởng Hồ Chí Minh trong cán bộ, đảng viên và nhân dân.</p>`,
    },
    {
      title: 'Hơn 100.000 lượt khách về thăm đền thờ Bác mỗi năm',
      category: 'Di tích',
      coverImage: CLD.dangHuong,
      publishedAt: null,
      excerpt:
        'Khu di tích Đền thờ Chủ tịch Hồ Chí Minh tại Long Đức tiếp tục đón hơn 100.000 lượt khách thăm viếng mỗi năm, khẳng định sức hút của "địa chỉ đỏ" giáo dục truyền thống.',
      content: `<p>Những năm gần đây, Khu di tích lịch sử, văn hóa cấp quốc gia Đền thờ Chủ tịch Hồ Chí Minh tại phường Long Đức, TP Trà Vinh liên tục đón hơn <strong>100.000 lượt khách</strong> thăm viếng mỗi năm — con số ấn tượng khẳng định sức hút và ý nghĩa quan trọng của "địa chỉ đỏ" này.</p><p>Du khách đến từ khắp các tỉnh thành trong cả nước, bao gồm các đoàn học sinh, sinh viên, cựu chiến binh, cán bộ đảng viên và du khách quốc tế. Khu di tích rộng 5,4 ha với nhiều hạng mục trưng bày phong phú, hàng năm đều tổ chức nhiều hoạt động văn hóa, giáo dục truyền thống.</p><p>Ban Quản lý khu di tích đã không ngừng nâng cao chất lượng phục vụ, bổ sung tài liệu trưng bày và tổ chức các triển lãm chuyên đề nhằm phục vụ ngày càng tốt hơn nhu cầu tham quan, nghiên cứu của nhân dân.</p>`,
    },
    {
      title: 'Số hóa Khu di tích Đền thờ Chủ tịch Hồ Chí Minh — trải nghiệm tham quan trực tuyến',
      category: 'Tin tức',
      coverImage: CLD.khuTrungBayAnh,
      publishedAt: new Date('2024-09-15'),
      excerpt:
        'Khu di tích đã hoàn thành dự án số hóa không gian 3D, mang đến trải nghiệm tham quan trực tuyến cho du khách trong và ngoài nước.',
      content: `<p>Khu di tích lịch sử Đền thờ Chủ tịch Hồ Chí Minh tại Long Đức đã hoàn thành dự án <strong>số hóa không gian 3D</strong>, mang đến trải nghiệm tham quan trực tuyến sống động cho du khách trong và ngoài nước không có điều kiện đến thăm trực tiếp.</p><p>Toàn bộ các hạng mục của khu di tích — từ điện thờ, nhà trưng bày, nhà sàn mô hình đến khu vực ngoài trời — đều được quét 3D và dựng thành ảnh toàn cảnh 360 độ có độ phân giải cao. Du khách có thể "đi dạo" ảo qua từng không gian, phóng to xem chi tiết các hiện vật và nghe thuyết minh audio bằng tiếng Việt và tiếng Anh.</p><p>Dự án là bước đột phá trong việc ứng dụng công nghệ số để bảo tồn và phát huy giá trị di sản văn hóa, đưa khu di tích đến gần hơn với thế hệ trẻ và bạn bè quốc tế.</p>`,
    },
    {
      title: 'Lễ dâng hoa, dâng hương nhân kỷ niệm 135 năm ngày sinh Chủ tịch Hồ Chí Minh',
      category: 'Sự kiện',
      coverImage: CLD.dangHuong,
      publishedAt: new Date('2025-05-19'),
      excerpt:
        'Ngày 19/5/2025, tại khu di tích diễn ra lễ dâng hoa, dâng hương trang nghiêm nhân kỷ niệm 135 năm ngày sinh Chủ tịch Hồ Chí Minh (19/5/1890 – 19/5/2025).',
      content: `<p>Sáng ngày 19/5/2025, Khu di tích lịch sử Đền thờ Chủ tịch Hồ Chí Minh tại Long Đức tổ chức lễ dâng hoa, dâng hương trang nghiêm nhân kỷ niệm <strong>135 năm ngày sinh Chủ tịch Hồ Chí Minh</strong> (19/5/1890 – 19/5/2025).</p><p>Tham dự lễ có lãnh đạo tỉnh Trà Vinh, thành phố Trà Vinh, các cơ quan, đơn vị, trường học và đông đảo nhân dân địa phương. Sau lễ dâng hương, các đại biểu cùng nhau ôn lại thân thế, sự nghiệp vĩ đại của Chủ tịch Hồ Chí Minh — vị lãnh tụ thiên tài, anh hùng giải phóng dân tộc, danh nhân văn hóa thế giới.</p><p>Ngày 19/5 hàng năm là dịp để mỗi người dân, đặc biệt là thế hệ trẻ, ôn lại và học tập tấm gương đạo đức Hồ Chí Minh, tiếp tục phấn đấu xây dựng đất nước giàu mạnh, văn minh.</p>`,
    },
    {
      title: 'Hướng dẫn tham quan Khu di tích Đền thờ Bác Hồ tại Long Đức',
      category: 'Thông báo',
      coverImage: CLD.toanCanh,
      publishedAt: new Date('2024-12-01'),
      excerpt:
        'Ban Quản lý khu di tích thông báo giờ mở cửa, quy định tham quan và các lưu ý dành cho du khách và các đoàn tham quan.',
      content: `<h2>Giờ mở cửa</h2><p>Khu di tích mở cửa hàng ngày (kể cả ngày lễ, Tết): <strong>Sáng: 7:30 – 11:30 | Chiều: 13:30 – 17:00</strong>. Vào cửa miễn phí.</p><h2>Quy định tham quan</h2><ul><li>Ăn mặc lịch sự, trang nghiêm khi vào điện thờ</li><li>Không gây ồn ào trong khu vực đền chính</li><li>Không hái hoa, bẻ cành trong khuôn viên</li><li>Giữ vệ sinh chung trong toàn bộ khuôn viên</li></ul><h2>Đăng ký đoàn</h2><p>Các đoàn tham quan (từ 20 người trở lên) vui lòng đăng ký trước qua điện thoại <strong>(0294) 3 855.369</strong> hoặc email <strong>bqlditich@travinh.gov.vn</strong> để Ban Quản lý sắp xếp đón tiếp và bố trí hướng dẫn viên.</p><h2>Đường đến khu di tích</h2><p>Địa chỉ: Ấp Vĩnh Hội, phường Long Đức, TP Trà Vinh. Cách trung tâm thành phố khoảng 4 km về phía Bắc theo đường về xã Long Đức (~15 phút bằng xe máy hoặc ô tô).</p>`,
    },
  ];

  await Promise.all(
    posts.map(({ title, publishedAt, ...rest }) =>
      prisma.post.create({
        data: { title, slug: slugify(title), published: publishedAt ? true : false, publishedAt, ...rest },
      })
    )
  );

  // ── Tour Groups ────────────────────────────────────────────────────────────
  const soon = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

  await prisma.tourGroup.createMany({
    data: [
      {
        groupName: 'Trường THPT Nguyễn Đáng',
        contactName: 'Cô Ngọc Lan',
        phone: '0901234567',
        date: soon(7),
        size: 45,
        status: 'PENDING',
      },
      {
        groupName: 'Đoàn cựu chiến binh Quận 1 TP.HCM',
        contactName: 'Ông Trần Văn Minh',
        phone: '0912345678',
        date: soon(14),
        size: 28,
        status: 'APPROVED',
      },
      {
        groupName: 'Công ty Du lịch Mê Kông Xanh',
        contactName: 'Anh Phạm Tuấn',
        phone: '0987654321',
        date: soon(3),
        size: 60,
        note: 'Cần hướng dẫn viên tiếng Anh cho đoàn khách quốc tế',
        status: 'APPROVED',
      },
      {
        groupName: 'Trường Đại học KHXH&NV TP.HCM',
        contactName: 'Thầy Nguyễn Văn Hùng',
        phone: '0934567890',
        date: soon(21),
        size: 35,
        note: 'Sinh viên Khoa Lịch sử, thực tế môn Di sản văn hóa',
        status: 'PENDING',
      },
      {
        groupName: 'Hội Phụ nữ phường 5, TP Trà Vinh',
        contactName: 'Chị Lê Thị Hoa',
        phone: '0945678901',
        date: soon(10),
        size: 22,
        status: 'PENDING',
      },
      {
        groupName: 'Trường Tiểu học Long Đức 1',
        contactName: 'Thầy Hiệu trưởng Bùi Tân',
        phone: '0978123456',
        date: soon(5),
        size: 80,
        note: 'Chương trình "Em học lịch sử địa phương" — cần khu vui chơi sau tham quan',
        status: 'REJECTED',
      },
    ],
  });

  // ── Contacts ───────────────────────────────────────────────────────────────
  await prisma.contact.createMany({
    data: [
      {
        name: 'Nguyễn Thị Thanh Hương',
        email: 'huong.nguyen@example.com',
        message: 'Cho tôi hỏi giờ mở cửa của khu di tích vào ngày lễ Giỗ Tổ Hùng Vương có thay đổi không?',
      },
      {
        name: 'Trần Minh Quốc',
        email: 'quoc.tran@example.com',
        message:
          'Tôi muốn tổ chức chuyến tham quan cho đoàn học sinh lớp 12, khoảng 40 em. Di tích có hỗ trợ thuyết minh và có khu ăn trưa không ạ?',
      },
      {
        name: 'Lê Văn Khoa',
        email: 'khoa.le@example.com',
        message:
          'Tôi có một số bức ảnh và tài liệu về khu di tích từ những năm 1990 muốn tặng cho khu di tích. Xin liên hệ lại giúp tôi.',
      },
      {
        name: 'Phạm Thị Ngọc Diễm',
        email: 'diem.pham@example.com',
        message: 'Bãi đỗ xe ô tô lớn (xe 45 chỗ) có gần cổng vào không? Đoàn chúng tôi 3 xe sẽ đến vào cuối tuần này.',
      },
      {
        name: 'Võ Hoàng Nam',
        email: 'nam.vo@example.com',
        message:
          'Tôi là sinh viên ngành báo chí, muốn xin phép quay phim tài liệu về khu di tích cho đề tài tốt nghiệp. Thủ tục xin phép như thế nào ạ?',
      },
    ],
  });

  console.log(
    'Seeded: 5 rooms, 12 artifacts (4 featured), 8 posts, 4 exhibitions (2 ongoing), 6 tour groups, 5 contacts'
  );
}

async function main() {
  await seedAdmin();
  await seedFeatures();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
