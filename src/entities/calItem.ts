import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class CalItem extends BaseEntity {
	@PrimaryColumn("int")
	id: number;

	@Column("int")
	grade: number;

	@Column("text")
	start: string;

	@Column("text")
	summary: string;

	@Column("text", { default: "Alfrink College" })
	location: string;

	@Column("boolean", { default: true })
	allDay: boolean;
}
