import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  ManyToOne,
} from "typeorm";
import Partner from "./Partner.entity";

@Entity("licenseKey")
export default class LicenseKey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  key!: String;

  @ManyToOne(() => Partner, (partner) => partner.liscenseKey)
  partner!: Partner;
}
