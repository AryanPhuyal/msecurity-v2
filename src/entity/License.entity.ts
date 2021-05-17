import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from "typeorm";
import Cost from "./Cost.entity";
import Partner from "./Partner.entity";
import Tranjection from "./Tranjection.entity";
import User from "./User.entity";

@Entity()
export class License {
  @PrimaryGeneratedColumn("uuid")
  id!: String;

  @Column({ unique: true })
  sn!: String;

  @Column({ nullable: true })
  expiresAt!: Date;

  @Column({ unique: true })
  license!: String;

  @Column({ nullable: true })
  device!: String;

  @Column({ nullable: true })
  deviceType!: String;

  @Column({ nullable: true })
  timeOfActivation!: Date;

  @Column({ nullable: true })
  expires!: boolean;

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

  @ManyToOne(() => User, (user) => user.licenses)
  user!: User;

  @ManyToOne(() => Cost, (cost) => cost.licenses)
  cost!: Cost;

  @ManyToOne(() => Partner, (partner) => partner.licenses)
  partner!: Partner;

  @ManyToOne(() => Tranjection, (tranjection) => tranjection.licenses)
  tranjection!: Tranjection;
}
