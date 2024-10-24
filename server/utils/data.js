import products from '../models/products.js';
import users from '../models/users.js';
import bcrypt from 'bcrypt';

export async function sendData() {
  const user = users.find();
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('123456', salt);

    await users.create([
      {
        fullName: 'Nguyễn Chung Đức',
        email: 'nguyenchungduc2002@gmail.com',
        password: hashPassword,
        phone: '0962750965',
        shippingAddress:
          '95 Phan Đăng Lưu Phường Hòa Cường Nam Quận Hải Châu TP Đà Nẵng',
        orderHistory: [],
        isAdmin: false,
      },
      {
        fullName: 'Nguyễn Thị Phúc',
        email: 'nguyenphuc@gmail.com',
        password: hashPassword,
        phone: '0962750965',
        shippingAddress:
          '135 Lê Thanh Nghị Phường Hòa Cường Nam Quận Hải Châu TP Đà Nẵng',
        orderHistory: [],
        isAdmin: true,
      },
    ]);
  }

  const product = products.find();
  if (!product) {
    await products.create([
      {
        name: 'Laptop Dell Vostro 3520',
        image: '',
        price: 12490000,
        category: 'electronics',
        description:
          'Hãng sản xuất : DELL Model : DELL OPTIPLEX 3020, 7020, 9020 SFF VGA : Graphics on Card VGA 1G ( chơi game và xem phim cực mượt ) onboard Integrated Intel® 2000 Graphics Media Accelerator Card mạng : 10/100/1000Mbps Card âm thanh : Onboard 2.1 Hight Definition Nguần : auto 100v-240v 265w Hệ điều hành cài sẵn : win7 hoặc win10 Tính năng cổng giao tiếp : USB 12 cổng 2.0. PS2 có 2 cổng Analog (VGA) Audio In-Out.',
        inventory_quantity: 12,
        brand: 'Dell',
        color: 'Black',
      },
      {
        name: 'Laptop Dell Vostro 3520',
        image: '',
        price: 12490000,
        category: 'electronics',
        description:
          'Hãng sản xuất : DELL Model : DELL OPTIPLEX 3020, 7020, 9020 SFF VGA : Graphics on Card VGA 1G ( chơi game và xem phim cực mượt ) onboard Integrated Intel® 2000 Graphics Media Accelerator Card mạng : 10/100/1000Mbps Card âm thanh : Onboard 2.1 Hight Definition Nguần : auto 100v-240v 265w Hệ điều hành cài sẵn : win7 hoặc win10 Tính năng cổng giao tiếp : USB 12 cổng 2.0. PS2 có 2 cổng Analog (VGA) Audio In-Out.',
        inventory_quantity: 12,
        brand: 'Dell',
        color: 'Black',
      },
    ]);
  }
}
