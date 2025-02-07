
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormMultiDropDown } from "@/components/forms/form-multi-dropdown";

export default function SectorDetails({ errors }: ErrorProps) {
    const [selectedPersonsWithDisability, setSelectedPersonsWithDisability] = useState("");
    const [selectedIP, setSelectedIP] = useState(""); //this is for showing and hiding group of IPs
  
    return (
        <>
            <div className="space-y-12">
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 gap-y-5 gap-x-[50px] mb-2">
                    <div className="p-2">
                        <Label htmlFor="academe" className="block text-sm font-medium">Academe</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="academeNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="academeYes" />
                                    <Label htmlFor="academeYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="academeNo" />
                                    <Label htmlFor="academeNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.academe && (
                            <p className="mt-2 text-sm text-red-500">{errors.academe[0]}</p>
                        )}
                    </div>
                    <div className="p-2 ">
                        <Label htmlFor="affected_by_disaster" className="block text-sm font-medium">Affected by Disaster</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="affectedByDisasterYes" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="affectedByDisasterYes" />
                                    <Label htmlFor="affectedByDisasterYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="affectedByDisasterNo" />
                                    <Label htmlFor="affectedByDisasterNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.affected_by_disaster && (
                            <p className="mt-2 text-sm text-red-500">{errors.affected_by_disaster[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="business" className="block text-sm font-medium">Business</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="businessNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="businessYes" />
                                    <Label htmlFor="businessYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="businessNo" />
                                    <Label htmlFor="businessNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.business && (
                            <p className="mt-2 text-sm text-red-500">{errors.business[0]}</p>
                        )}
                    </div>
                    <div className="p-2 ">
                        <Label htmlFor="children_youth_protection" className="block text-sm font-medium">Children and Youth in Need of Special Protection</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="childrenYouthProtectionYes" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="childrenYouthProtectionYes" />
                                    <Label htmlFor="childrenYouthProtectionYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="childrenYouthProtectionNo" />
                                    <Label htmlFor="childrenYouthProtectionNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.children_youth_protection && (
                            <p className="mt-2 text-sm text-red-500">{errors.children_youth_protection[0]}</p>
                        )}
                    </div>
                    <div className="p-2 ">
                        <Label htmlFor="differently_abled" className="block text-sm font-medium">Differently Abled</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="differentlyAbledNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="differentlyAbledYes" />
                                    <Label htmlFor="differentlyAbledYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="differentlyAbledNo" />
                                    <Label htmlFor="differentlyAbledNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.differently_abled && (
                            <p className="mt-2 text-sm text-red-500">{errors.differently_abled[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="farmer" className="block text-sm font-medium">Farmer</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="farmerNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="farmerYes" />
                                    <Label htmlFor="farmerYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="farmerNo" />
                                    <Label htmlFor="farmerNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.farmer && (
                            <p className="mt-2 text-sm text-red-500">{errors.farmer[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="family_heads" className="block text-sm font-medium">Family Heads in Need of Assistance</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="familyHeadsYes" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="familyHeadsYes" />
                                    <Label htmlFor="familyHeadsYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="familyHeadsNo" />
                                    <Label htmlFor="familyHeadsNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.family_heads && (
                            <p className="mt-2 text-sm text-red-500">{errors.family_heads[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="fisherfolks" className="block text-sm font-medium">Fisherfolks</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="fisherfolksNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="fisherfolksYes" />
                                    <Label htmlFor="fisherfolksYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="fisherfolksNo" />
                                    <Label htmlFor="fisherfolksNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.fisherfolks && (
                            <p className="mt-2 text-sm text-red-500">{errors.fisherfolks[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="government" className="block text-sm font-medium">Government</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="governmentNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="governmentYes" />
                                    <Label htmlFor="governmentYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="governmentNo" />
                                    <Label htmlFor="governmentNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.government && (
                            <p className="mt-2 text-sm text-red-500">{errors.government[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="indigenous_people" className="block text-sm font-medium">Indigenous People (IP)</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="ipYes" className="flex gap-4"                                                          
                             onValueChange={(value) => setSelectedIP(value)}>
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="ipYes" />
                                    <Label htmlFor="ipYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="ipNo" />
                                    <Label htmlFor="ipNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.four_ps_beneficiary && (
                            <p className="mt-2 text-sm text-red-500">{errors.four_ps_beneficiary[0]}</p>
                        )}
                    </div>
                    {selectedIP === "Yes" && (
                        <div className="p-2  ">
                            <Label htmlFor="groupofip" className="block text-sm font-medium">Group of IP</Label>
                            <div className="mt-1">
                                <FormMultiDropDown />
                            </div>
                            {errors?.groupofip && (
                                <p className="mt-2 text-sm text-red-500">{errors.groupofip[0]}</p>
                            )}
                        </div>
                    )}
                    <div className="p-2">
                        <Label htmlFor="ngo" className="block text-sm font-medium">NGO</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="ngoNo" className="flex gap-4"> 
                                <div className="flex items-center"> 
                                    <RadioGroupItem value="Yes" id="ngoYes" />
                                    <Label htmlFor="ngoYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center"> 
                                    <RadioGroupItem value="No" id="ngoNo" />
                                    <Label htmlFor="ngoNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.ngo && (
                            <p className="mt-2 text-sm text-red-500">{errors.ngo[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="out_of_school_youth" className="block text-sm font-medium">Out of School Youth (OSY)</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="osyYes" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="osyYes" />
                                    <Label htmlFor="osyYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="osyNo" />
                                    <Label htmlFor="osyNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.out_of_school_youth && (
                            <p className="mt-2 text-sm text-red-500">{errors.out_of_school_youth[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="persons_with_disability" className="block text-sm font-medium">Persons with Disability</Label>
                        <div className="mt-1">
                            <RadioGroup
                                defaultValue="No"
                                className="flex gap-4"
                                onValueChange={(value) => setSelectedPersonsWithDisability(value)}
                            >
                                <div className="flex items-center"> 
                                    <RadioGroupItem value="Yes" id="personsWithDisabilityYes" />
                                    <Label htmlFor="personsWithDisabilityYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center"> 
                                    <RadioGroupItem value="No" id="personsWithDisabilityNo" />
                                    <Label htmlFor="personsWithDisabilityNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.persons_with_disability && (
                            <p className="mt-2 text-sm text-red-500">{errors.persons_with_disability[0]}</p>
                        )}
                    </div>
                    {selectedPersonsWithDisability === "Yes" && (
                        <div className="p-2  ">
                            <Label htmlFor="typeofdisability" className="block text-sm font-medium">Type of Disability</Label>
                            <div className="mt-1">
                                <FormMultiDropDown />
                            </div>
                            {errors?.typeofdisability && (
                                <p className="mt-2 text-sm text-red-500">{errors.typeofdisability[0]}</p>
                            )}
                        </div>
                    )}
                    <div className="p-2">
                        <Label htmlFor="po" className="block text-sm font-medium">PO</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="poNo" className="flex gap-4"> 
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="poYes" />
                                    <Label htmlFor="poYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="poNo" />
                                    <Label htmlFor="poNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.po && (
                            <p className="mt-2 text-sm text-red-500">{errors.po[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="religious" className="block text-sm font-medium">Religious</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="religiousNo" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="religiousYes" />
                                    <Label htmlFor="religiousYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="religiousNo" />
                                    <Label htmlFor="religiousNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.religious && (
                            <p className="mt-2 text-sm text-red-500">{errors.religious[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="senior_citizen" className="block text-sm font-medium">Senior Citizen</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="seniorCitizenYes" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="seniorCitizenYes" />
                                    <Label htmlFor="seniorCitizenYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="seniorCitizenNo" />
                                    <Label htmlFor="seniorCitizenNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.senior_citizen && (
                            <p className="mt-2 text-sm text-red-500">{errors.senior_citizen[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="solo_parent" className="block text-sm font-medium">Solo Parent</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="soloParentYes" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="soloParentYes" />
                                    <Label htmlFor="soloParentYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="soloParentNo" />
                                    <Label htmlFor="soloParentNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.solo_parent && (
                            <p className="mt-2 text-sm text-red-500">{errors.solo_parent[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="women" className="block text-sm font-medium">Women</Label>
                        <div className="mt-1">
                            <RadioGroup defaultValue="yesWomen" className="flex gap-4">
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="yesWomen" />
                                    <Label htmlFor="yesWomen" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="noWomen" />
                                    <Label htmlFor="noWomen" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.women && (
                            <p className="mt-2 text-sm text-red-500">{errors.women[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="others" className="block text-sm font-medium">Others</Label>
                        <div className="mt-1">
                            <Input id="others" placeholder="Please specify" />
                        </div>
                        {errors?.others && (
                            <p className="mt-2 text-sm text-red-500">{errors.others[0]}</p>
                        )}
                    </div>

                </div>

            </div >


        </>
    )
}