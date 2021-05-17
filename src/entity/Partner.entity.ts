import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from "typeorm";
import { License } from "./License.entity";
import LicenseKey from "./liscenseKey.entity";
import Tranjection from "./Tranjection.entity";

@Entity("partner")
export default class Partner {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ default: "normal" })
  role!: string;

  @Column({ type: Number, default: 0 })
  dueUpTo!: Number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;
  @Column()
  password!: string;

  @Column()
  location!: string;

  @Column({ type: Number, default: 50 })
  commission!: Number;

  @Column({ type: String, nullable: false, unique: true })
  shopId!: String;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  public updatedAt!: Date;

  @OneToMany(() => License, (license) => license.partner)
  licenses!: License[];

  @OneToMany(() => Tranjection, (tranjection) => tranjection.partner)
  tranjections!: Tranjection[];

  @OneToMany(() => LicenseKey, (licenseKey) => licenseKey.partner)
  liscenseKey!: LicenseKey;
}
